/* eslint-disable max-lines-per-function */

import 'dotenv/config';

import request from 'supertest';
import mysql from 'mysql2/promise';
import { randomUUID } from 'crypto';
import CryptoService from '@/modules/crypto/services/crypto.service';
import { User } from '@/modules/user/models/user.model';
import { Todo } from '@/modules/todo/models/todo.model';

const baseUrl = process.env.BASE_URL ?? 'http://localhost:3000';

const agent = request.agent(baseUrl);
const email = randomUUID() + '@test.com';
let connection: mysql.Connection;
let token: string;
let userId: number;
let userIdBis: number;
let todoId: number;
let todoIdBis: number;
const cryptoService = new CryptoService();

describe('Delete Todo', () => {
  beforeAll(async () => {
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_ROOT_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });

    // Register a user directly in the database
    const hashedPassword = await cryptoService.hashPassword('password');
    await connection.query(
      'INSERT INTO user (email, password, firstname, name) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, 'John', 'Doe']
    );

    await connection.query(
      'INSERT INTO user (email, password, firstname, name) VALUES (?, ?, ?, ?)',
      ['bis.' + email, hashedPassword, 'John', 'Doe']
    );

    // Get the inserted user ID
    const [rows] = await connection.query(
      'SELECT id FROM user WHERE email = ?',
      [email]
    );
    userId = (rows as User[])[0].id;

    // Get the inserted user ID for the second user
    const [rowsBis] = await connection.query(
      'SELECT id FROM user WHERE email = ?',
      ['bis.' + email]
    );
    userIdBis = (rowsBis as User[])[0].id;

    // Create a todo
    await connection.query(
      'INSERT INTO todo (title, description, due_time, user_id, status) VALUES (?, ?, ?, ?, ?)',
      [
        'Test Todo',
        'Test Description',
        '2021-03-03 19:24:00',
        userId,
        'not started',
      ]
    );

    // Create a second todo
    await connection.query(
      'INSERT INTO todo (title, description, due_time, user_id, status) VALUES (?, ?, ?, ?, ?)',
      [
        'Test Todo 2',
        'Test Description 2',
        '2021-03-03 19:24:00',
        userIdBis,
        'in progress',
      ]
    );

    // Get the first inserted todo ID
    const [rowsTodo] = await connection.query(
      'SELECT id FROM todo WHERE user_id = ?',
      [userId]
    );
    todoId = (rowsTodo as Todo[])[0].id;

    // Get the second inserted todo ID
    const [rowsTodoBis] = await connection.query(
      'SELECT id FROM todo WHERE user_id = ?',
      [userIdBis]
    );
    todoIdBis = (rowsTodoBis as Todo[])[0].id;

    // Create a token manually
    token = cryptoService.signToken({
      id: userId,
      email,
      password: hashedPassword,
      firstname: 'John',
      name: 'Doe',
      created_at: new Date().toISOString(),
    });
  });

  describe('DELETE /todos/:id', () => {
    it('should get all todos', async () => {
      const response = await agent
        .delete(`/todos/${todoId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.msg).toBe(
        `Successfully deleted record number: ${todoId}`
      );
    });

    it('should throw an unauthorized error if no token is provided', async () => {
      const response = await agent.delete(`/todos/${todoId}`);

      expect(response.status).toBe(401);
      expect(response.body.msg).toBe('No token, authorization denied');
    });

    it('should throw an unauthorized error if invalid token is provided', async () => {
      const response = await agent
        .delete(`/todos/${todoId}`)
        .set('Authorization', `Bearer invalid-token`);

      expect(response.status).toBe(401);
      expect(response.body.msg).toBe('Invalid token');
    });

    it('should throw a bad request error if the id is not a number', async () => {
      const response = await agent.delete(`/todos/not-a-number`);

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe('Bad parameter');
    });

    it('should throw a bad request error if the id is negative', async () => {
      const response = await agent.delete(`/todos/-1`);

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe('Bad parameter');
    });

    it('should throw a not found error if the todo does not exist', async () => {
      const response = await agent
        .delete(`/todos/999999`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.msg).toBe('Not found');
    });

    it('should throw an unauthorized error if the todo does not belong to the user', async () => {
      const response = await agent
        .delete(`/todos/${todoIdBis}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(401);
      expect(response.body.msg).toBe('No token, authorization denied');
    });
  });

  afterAll(async () => {
    await connection.query('DELETE FROM user WHERE email = ?', [email]);
    await connection.query('DELETE FROM user WHERE email = ?', [
      'bis.' + email,
    ]);
    await connection.query('DELETE FROM todo WHERE user_id = ?', [userId]);
    await connection.query('DELETE FROM todo WHERE user_id = ?', [userIdBis]);
    await connection.end();
  });
});
