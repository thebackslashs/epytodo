/* eslint-disable max-lines-per-function */

import request from 'supertest';
import mysql from 'mysql2/promise';
import 'dotenv/config';
import { randomUUID } from 'crypto';

const baseUrl = process.env.BASE_URL ?? 'http://localhost:3000';

const agent = request.agent(baseUrl);
const email = randomUUID() + '@test.com';
let connection: mysql.Connection;

describe('Register', () => {
  beforeAll(async () => {
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_ROOT_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });
  });

  beforeEach(async () => {
    await connection.query('DELETE FROM user WHERE email = ?', [email]);
  });

  it('should register a new user', async () => {
    const response = await agent.post('/register').send({
      email,
      password: 'password',
      firstname: 'John',
      name: 'Doe',
    });

    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body.token).toBeDefined();
  });

  it('should not register a user with an existing email', async () => {
    await connection.query(
      'INSERT INTO user (email, password, firstname, name) VALUES (?, ?, ?, ?)',
      [email, 'password', 'John', 'Doe']
    );

    const response = await agent.post('/register').send({
      email,
      password: 'password',
      firstname: 'John',
      name: 'Doe',
    });

    expect(response.status).toBe(400);
    expect(response.body).toBeDefined();
    expect(response.body.msg).toBe('Account already exists');
  });

  it('should not register a user with an invalid email', async () => {
    const response = await agent.post('/register').send({
      email: 'invalid-email',
      password: 'password',
      firstname: 'John',
      name: 'Doe',
    });

    expect(response.status).toBe(400);
    expect(response.body).toBeDefined();
    expect(response.body.msg).toBe('Bad parameter');
  });

  describe('should not register a user with not enough parameters (firstname, name, email, password)', () => {
    it('should not register a user with no firstname', async () => {
      const response = await agent.post('/register').send({
        email,
        password: 'password',
        name: 'Doe',
      });

      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
      expect(response.body.msg).toBe('Bad parameter');
    });

    it('should not register a user with no name', async () => {
      const response = await agent.post('/register').send({
        email,
        password: 'password',
        firstname: 'John',
      });

      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
      expect(response.body.msg).toBe('Bad parameter');
    });

    it('should not register a user with no email', async () => {
      const response = await agent.post('/register').send({
        password: 'password',
        firstname: 'John',
        name: 'Doe',
      });

      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
      expect(response.body.msg).toBe('Bad parameter');
    });

    it('should not register a user with no password', async () => {
      const response = await agent.post('/register').send({
        email,
        firstname: 'John',
        name: 'Doe',
      });

      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
      expect(response.body.msg).toBe('Bad parameter');
    });
  });

  it('should not allow extra parameters', async () => {
    const response = await agent.post('/register').send({
      email,
      password: 'password',
      firstname: 'John',
      name: 'Doe',
      id: 1,
    });

    expect(response.status).toBe(400);
    expect(response.body).toBeDefined();
    expect(response.body.msg).toBe('Bad parameter');
  });

  afterAll(async () => {
    await connection.end();
  });
});
