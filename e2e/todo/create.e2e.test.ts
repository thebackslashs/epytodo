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

describe('Create Todo', () => {
  beforeAll(async () => {
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_ROOT_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });

    const [result] = await connection.query<mysql.ResultSetHeader>(
      'INSERT INTO user (email, password, firstname, name) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, 'John', 'Doe']
    );
    userId = result.insertId;

    const response = await agent.post('/login').send({
      email,
      password,
    });
    token = response.body.token;
  });

  beforeEach(async () => {
    await connection.query('DELETE FROM todo WHERE user_id = ?', [userId]);
  });

  it('should create a new todo', async () => {
    const response = await agent
      .post('/todos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Todo',
        description: 'Test Description',
        due_time: '2024-12-31T23:59:59.999Z',
        status: 'not started',
        user_id: userId,
      });

    expect(response.status).toBe(201);
    expect(response.body.todo).toBeDefined();
    expect(response.body.todo.title).toBe('Test Todo');
    expect(response.body.todo.description).toBe('Test Description');
    expect(response.body.todo.status).toBe('not started');
    expect(response.body.todo.user_id).toBe(userId);
  });

  it('should not create a todo without authentication', async () => {
    const response = await agent.post('/todos').send({
      title: 'Test Todo',
      description: 'Test Description',
      due_time: '2024-12-31T23:59:59.999Z',
      status: 'not started',
      user_id: userId,
    });

    expect(response.status).toBe(401);
    expect(response.body.msg).toBe('No token, authorization denied');
  });

  describe('field validation', () => {
    it('should not create a todo without title', async () => {
      const response = await agent
        .post('/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'Test Description',
          due_time: '2024-12-31T23:59:59.999Z',
          status: 'not started',
          user_id: userId,
        });

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe('Bad parameter');
    });

    it('should not create a todo with empty title', async () => {
      const response = await agent
        .post('/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: '',
          description: 'Test Description',
          due_time: '2024-12-31T23:59:59.999Z',
          status: 'not started',
          user_id: userId,
        });

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe('Bad parameter');
    });

    it('should not create a todo with invalid status', async () => {
      const response = await agent
        .post('/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Todo',
          description: 'Test Description',
          due_time: '2024-12-31T23:59:59.999Z',
          status: 'invalid',
          user_id: userId,
        });

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe('Bad parameter');
    });

    it('should not create a todo with invalid date format', async () => {
      const response = await agent
        .post('/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Todo',
          description: 'Test Description',
          due_time: 'invalid-date',
          status: 'not started',
          user_id: userId,
        });

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe('Bad parameter');
    });
  });

  afterAll(async () => {
    await connection.query('DELETE FROM todo WHERE user_id = ?', [userId]);
    await connection.query('DELETE FROM user WHERE id = ?', [userId]);
    await connection.end();
  });
});