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

  describe('GET /user', () => {
    it('should get user info with valid token', async () => {
      const response = await agent
        .get('/user')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.email).toBe(email);
      expect(response.body.firstname).toBe('John');
      expect(response.body.name).toBe('Doe');
      expect(response.body.id).toBe(userId);
      expect(response.body.created_at).toBeDefined();
    });

    it('should return 401 when no token is provided', async () => {
      const response = await agent.get('/user');

      expect(response.status).toBe(401);
      expect(response.body).toBeDefined();
      expect(response.body.msg).toBe('No token, authorization denied');
    });

    it('should return 401 when invalid token is provided', async () => {
      const response = await agent
        .get('/user')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body).toBeDefined();
      expect(response.body.msg).toBe('Invalid token');
    });

    it('should return 401 when malformed token is provided', async () => {
      const response = await agent
        .get('/user')
        .set('Authorization', 'invalid-token');

      expect(response.status).toBe(401);
      expect(response.body).toBeDefined();
      expect(response.body.msg).toBe('No token, authorization denied');
    });
  });

  describe('GET /users/{identifier}', () => {
    it('should get user by ID', async () => {
      const response = await agent
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.id).toBe(userId);
      expect(response.body.email).toBe(email);
    });

    it('should get user by email', async () => {
      const response = await agent
        .get(`/users/${email}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.email).toBe(email);
    });

    describe('GET /users/{identifier} (404)', () => {
      it('should return 404 for non-existent user (id)', async () => {
        const response = await agent
          .get('/users/999999')
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body).toBeDefined();
        expect(response.body.msg).toBe('Not found');
      });

      it('should return 404 for non-existent user (email)', async () => {
        const response = await agent
          .get('/users/999999@test.com')
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body).toBeDefined();
        expect(response.body.msg).toBe('Not found');
      });
    });

    describe('GET /users/{identifier} (401)', () => {
      it('should return 401 when no token is provided', async () => {
        const response = await agent.get('/users/999999');

        expect(response.status).toBe(401);
        expect(response.body).toBeDefined();
        expect(response.body.msg).toBe('No token, authorization denied');
      });

      it('should return 401 when invalid token is provided', async () => {
        const response = await agent
          .get('/users/999999')
          .set('Authorization', 'Bearer invalid-token');

        expect(response.status).toBe(401);
        expect(response.body).toBeDefined();
        expect(response.body.msg).toBe('Invalid token');
      });
    });
  });

  describe('PUT /users/{id}', () => {
    it('should update user information', async () => {
      const updatedData = {
        firstname: 'Jane',
        name: 'Smith',
        email: email,
        password: 'newpassword',
      };

      const response = await agent
        .put(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.firstname).toBe('Jane');
      expect(response.body.name).toBe('Smith');
      expect(response.body.email).toBe(email);
    });

    it('should return 400 for invalid data', async () => {
      const response = await agent
        .put(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 'invalid-email' });

      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
      expect(response.body.msg).toBe('Bad parameter');
    });

    it('should return 401 for other user', async () => {
      const response = await agent
        .put('/users/999999')
        .set('Authorization', `Bearer ${token}`)
        .send({ firstname: 'Jane' });

      expect(response.status).toBe(401);
      expect(response.body).toBeDefined();
      expect(response.body.msg).toBe('No token, authorization denied');
    });
  });

  describe('DELETE /users/{id}', () => {
    it('should delete user', async () => {
      const response = await agent
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body).toEqual({
        msg: `Successfully deleted record number: ${userId.toString()}`,
      });
    });

    it('should return 401 for other user', async () => {
      const response = await agent
        .delete('/users/999999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(401);
      expect(response.body).toBeDefined();
      expect(response.body.msg).toBe('No token, authorization denied');
    });
  });

  afterAll(async () => {
    await connection.query('DELETE FROM user WHERE email = ?', [email]);
    await connection.end();
  });
});
