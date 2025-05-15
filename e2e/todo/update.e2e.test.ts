/* eslint-disable max-lines-per-function */

import 'dotenv/config';
import request from 'supertest';
import mysql from 'mysql2/promise';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';

const baseUrl = process.env.BASE_URL ?? 'http://localhost:3000';
const agent = request.agent(baseUrl);
const email = randomUUID() + '@test.com';
const password = 'password';
const salt = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync(password, salt);
let connection: mysql.Connection;
let token: string;
let userId: number;
let todoId: number;

describe('Update Todo', () => {
  beforeAll(async () => {
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_ROOT_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });

    const [userResult] = await connection.query<mysql.ResultSetHeader>(
      'INSERT INTO user (email, password, firstname, name) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, 'John', 'Doe']
    );
    userId = userResult.insertId;

    const response = await agent.post('/login').send({
      email,
      password,
    });
    token = response.body.token;

    const [todoResult] = await connection.query<mysql.ResultSetHeader>(
      'INSERT INTO todo (title, description, due_time, status, user_id) VALUES (?, ?, ?, ?, ?)',
      ['Test Todo', 'Test Description', '2024-12-31 23:59:59', 'not started', userId]
    );
    todoId = todoResult.insertId;
  });

  it('should update a todo successfully', async () => {
    const response = await agent
      .put(`/todos/${todoId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Todo',
        description: 'Updated Description',
        due_time: '2025-12-31T23:59:59.999Z',
        status: 'in progress',
      });

    expect(response.status).toBe(200);
    expect(response.body.todo).toBeDefined();
    expect(response.body.todo.title).toBe('Updated Todo');
    expect(response.body.todo.description).toBe('Updated Description');
    expect(response.body.todo.status).toBe('in progress');
  });

  it('should update a todo partially', async () => {
    const response = await agent
      .put(`/todos/${todoId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Only Title Updated',
      });

    expect(response.status).toBe(200);
    expect(response.body.todo).toBeDefined();
    expect(response.body.todo.title).toBe('Only Title Updated');
  });

  it('should not update a todo without authentication', async () => {
    const response = await agent.put(`/todos/${todoId}`).send({
      title: 'Updated Todo',
    });

    expect(response.status).toBe(401);
    expect(response.body.msg).toBe('No token, authorization denied');
  });

  it('should not update a non-existent todo', async () => {
    const response = await agent
      .put('/todos/99999')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Todo',
      });

    expect(response.status).toBe(404);
    expect(response.body.msg).toBe('Not found');
  });

  describe('should validate fields', () => {
    it('should reject invalid status', async () => {
      const response = await agent
        .put(`/todos/${todoId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          status: 'invalid_status',
        });

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe('Bad parameter');
    });

    it('should reject too long title', async () => {
      const response = await agent
        .put(`/todos/${todoId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'a'.repeat(256),
        });

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe('Bad parameter');
    });

    it('should reject empty title', async () => {
      const response = await agent
        .put(`/todos/${todoId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: '',
        });

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe('Bad parameter');
    });

    it('should reject invalid date format', async () => {
      const response = await agent
        .put(`/todos/${todoId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          due_time: 'invalid-date',
        });

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe('Bad parameter');
    });
  });

  describe('should reject unauthorized updates', () => {
    let otherUserId: number;
    let otherTodoId: number;

    beforeAll(async () => {
      const otherEmail = randomUUID() + '@test.com';
      const [otherUserResult] = await connection.query<mysql.ResultSetHeader>(
        'INSERT INTO user (email, password, firstname, name) VALUES (?, ?, ?, ?)',
        [otherEmail, hashedPassword, 'Jane', 'Doe']
      );
      otherUserId = otherUserResult.insertId;

      const [otherTodoResult] = await connection.query<mysql.ResultSetHeader>(
        'INSERT INTO todo (title, description, due_time, status, user_id) VALUES (?, ?, ?, ?, ?)',
        ['Other Todo', 'Other Description', '2024-12-31 23:59:59', 'not started', otherUserId]
      );
      otherTodoId = otherTodoResult.insertId;
    });

    it('should not allow updating another user\'s todo', async () => {
      const response = await agent
        .put(`/todos/${otherTodoId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Trying to update other\'s todo',
        });

      expect(response.status).toBe(401);
      expect(response.body.msg).toBe('Unauthorized action');
    });

    afterAll(async () => {
      await connection.query('DELETE FROM todo WHERE user_id = ?', [otherUserId]);
      await connection.query('DELETE FROM user WHERE id = ?', [otherUserId]);
    });
  });

  afterAll(async () => {
    await connection.query('DELETE FROM todo WHERE user_id = ?', [userId]);
    await connection.query('DELETE FROM user WHERE id = ?', [userId]);
    await connection.end();
  });
});