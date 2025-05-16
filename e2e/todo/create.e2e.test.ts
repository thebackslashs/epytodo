/* eslint-disable max-lines-per-function */

import 'dotenv/config';

import request from 'supertest';
import mysql from 'mysql2/promise';
import { randomUUID } from 'crypto';
import CryptoService from '@/modules/crypto/services/crypto.service';
import { User } from '@/modules/user/models/user.model';

const baseUrl = process.env.BASE_URL ?? 'http://localhost:3000';

const agent = request.agent(baseUrl);
const email = randomUUID() + '@test.com';
let connection: mysql.Connection;
let token: string;
let userId: number;
const cryptoService = new CryptoService();

describe('User', () => {
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

    // Get the inserted user ID
    const [rows] = await connection.query(
      'SELECT id FROM user WHERE email = ?',
      [email]
    );
    userId = (rows as User[])[0].id;

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

  describe('POST /todos', () => {
    it('should create a todo', async () => {
      const response = await agent
        .post('/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Todo',
          description: 'Test Description',
          due_time: '2021-01-01 12:00:00',
          user_id: userId,
          status: 'not started',
        });

      expect(response.status).toBe(201);
      expect(response.body).toBeDefined();
      expect(response.body.title).toBe('Test Todo');
      expect(response.body.description).toBe('Test Description');
      expect(response.body.due_time).toBe('2021-01-01 12:00:00');
      expect(response.body.user_id).toBe(userId);
      expect(response.body.status).toBe('not started');
    });

    it('should throw an unauthorized error if no token is provided', async () => {
      const response = await agent.post('/todos').send({
        title: 'This is a test',
        description: 'This is a test',
        due_time: '2021-01-01 12:00:00',
        user_id: userId,
        status: 'not started',
      });

      expect(response.status).toBe(401);
      expect(response.body.msg).toBe('No token, authorization denied');
    });

    it('should throw an unauthorized error if the user is creating a todo for another user', async () => {
      const response = await agent.post('/todos').send({
        title: 'This is a test',
        description: 'This is a test',
        due_time: '2021-01-01 12:00:00',
        user_id: userId + 1,
        status: 'not started',
      });

      expect(response.status).toBe(401);
      expect(response.body.msg).toBe('No token, authorization denied');
    });

    describe('Todo due_time validation', () => {
      const invalidDates = [
        { date: '2021-01-01 12:00:65', name: 'invalid seconds' },
        { date: '2021-14-01 12:00:00', name: 'invalid month' },
        { date: '2021-01-45 12:00:00', name: 'invalid day' },
        { date: '2021-01-01 25:00:00', name: 'invalid hour' },
        { date: '2021-01-01 12:60:00', name: 'invalid minutes' },
        { date: 'invalid-date', name: 'completely invalid' },
      ];

      invalidDates.forEach(({ date, name }) => {
        it(`should not create a todo with ${name}`, async () => {
          const response = await agent
            .post('/todos')
            .set('Authorization', `Bearer ${token}`)
            .send({
              title: 'Test Todo',
              description: 'Test Description',
              due_time: date,
              user_id: userId,
              status: 'not started',
            });

          expect(response.status).toBe(400);
          expect(response.body.msg).toBe('Bad parameter');
        });
      });
    });

    describe('Todo status validation', () => {
      const validStatuses = ['not started', 'todo', 'in progress', 'done'];

      validStatuses.forEach((status) => {
        it(`should create a todo with status: ${status}`, async () => {
          const response = await agent
            .post('/todos')
            .set('Authorization', `Bearer ${token}`)
            .send({
              title: 'Test Todo',
              description: 'Test Description',
              due_time: '2021-01-01 12:00:00',
              user_id: userId,
              status,
            });

          expect(response.status).toBe(201);
          expect(response.body.status).toBe(status);
        });
      });

      it('should not create a todo with invalid status', async () => {
        const response = await agent
          .post('/todos')
          .set('Authorization', `Bearer ${token}`)
          .send({
            title: 'Test Todo',
            description: 'Test Description',
            due_time: '2021-01-01 12:00:00',
            user_id: userId,
            status: 'invalid-status',
          });

        expect(response.status).toBe(400);
        expect(response.body.msg).toBe('Bad parameter');
      });
    });

    it('should not create a todo with invalid user_id', async () => {
      const response = await agent
        .post('/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Todo',
          description: 'Test Description',
          due_time: '2021-01-01 12:00:00',
          user_id: 'invalid-user-id',
          status: 'not started',
        });

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe('Bad parameter');
    });

    describe('Todo field validation', () => {
      const invalidFields = [
        { field: 'title', value: '' },
        { field: 'description', value: '' },
        { field: 'due_time', value: '' },
        { field: 'user_id', value: '' },
      ];

      invalidFields.forEach(({ field, value }) => {
        it(`should not create a todo with empty ${field}`, async () => {
          const todoData = {
            title: 'Test Todo',
            description: 'Test Description',
            due_time: '2021-01-01 12:00:00',
            user_id: userId,
            status: 'not started',
            [field]: value,
          };

          const response = await agent
            .post('/todos')
            .set('Authorization', `Bearer ${token}`)
            .send(todoData);

          expect(response.status).toBe(400);
          expect(response.body.msg).toBe('Bad parameter');
        });
      });
    });
  });

  afterAll(async () => {
    await connection.query('DELETE FROM user WHERE email = ?', [email]);
    await connection.end();
  });
});
