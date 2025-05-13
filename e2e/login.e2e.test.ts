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

describe('Login', () => {
  beforeAll(async () => {
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_ROOT_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });
  });

  beforeEach(async () => {
    await connection.query(
      'INSERT INTO user (email, password, firstname, name) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, 'John', 'Doe']
    );
  });

  afterEach(async () => {
    await connection.query('DELETE FROM user WHERE email = ?', [email]);
  });

  it('should login a user', async () => {
    const response = await agent.post('/login').send({
      email,
      password,
    });

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.token).toBeDefined();
  });

  it('should not login a user with invalid credentials', async () => {
    const response = await agent.post('/login').send({
      email,
      password: 'invalid-password',
    });

    expect(response.status).toBe(401);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual({ msg: 'Invalid credentials' });
  });

  describe('should throw an error a parameter is missing', () => {
    it('should throw an error if no email is provided', async () => {
      const response = await agent.post('/login').send({
        password,
      });

      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
      expect(response.body.msg).toBe('Bad parameter');
    });

    it('should throw an error if no password is provided', async () => {
      const response = await agent.post('/login').send({
        email,
      });

      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
      expect(response.body.msg).toBe('Bad parameter');
    });

    it('should throw an error if no parameters are provided', async () => {
      const response = await agent.post('/login').send({});

      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
      expect(response.body.msg).toBe('Bad parameter');
    });
  });

  describe('should throw if field are not valid', () => {
    it('should throw an error if email is not valid', async () => {
      const response = await agent.post('/login').send({
        email: 'invalid-email',
        password,
      });

      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
      expect(response.body.msg).toBe('Bad parameter');
    });

    it('should throw an error if email is too long', async () => {
      const response = await agent.post('/login').send({
        email: 'a'.repeat(256) + '@test.com',
        password,
      });

      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
      expect(response.body.msg).toBe('Bad parameter');
    });

    it('should throw an error if password is too long', async () => {
      const response = await agent.post('/login').send({
        email,
        password: 'a'.repeat(256),
      });

      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
      expect(response.body.msg).toBe('Bad parameter');
    });

    it('should throw an error if password is too short', async () => {
      const response = await agent.post('/login').send({
        email,
        password: '',
      });

      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
      expect(response.body.msg).toBe('Bad parameter');
    });
  });

  describe('should throw if extra field is provided', () => {
    it('should throw an error if id is provided', async () => {
      const response = await agent.post('/login').send({
        email,
        password,
        id: 1,
      });

      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
      expect(response.body.msg).toBe('Bad parameter');
    });

    it('should throw an error if any other field is provided', async () => {
      const response = await agent.post('/login').send({
        email,
        password,
        extraField: 'extra-field',
      });

      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
      expect(response.body.msg).toBe('Bad parameter');
    });
  });

  afterAll(async () => {
    await connection.query('DELETE FROM user WHERE email = ?', [email]);
    await connection.end();
  });
});
