/* eslint-disable max-lines-per-function */

import 'dotenv/config';

import request from 'supertest';
import mysql from 'mysql2/promise';
import { randomUUID } from 'crypto';
import { createTodo, createUser, deleteTodo } from '../utils';
import { Todo } from '@/modules/todo/models/todo.model';

const baseUrl = process.env.BASE_URL ?? 'http://localhost:3000';

const agent = request.agent(baseUrl);
const email = randomUUID() + '@test.com';
let connection: mysql.Connection;
let token: string;
let userId: number;
let userIdBis: number;

const defaultTodo: Omit<Todo, 'id' | 'created_at' | 'user_id'> = {
  title: 'Test Todo',
  description: 'Test Description',
  due_time: '2021-03-03 19:24:00',
  status: 'not started',
};

describe('Update Todo', () => {
  beforeAll(async () => {
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_ROOT_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });

    // Register a user directly in the database
    const { id: firstUserId, token: firstUserToken } = await createUser({
      connection,
      email,
      password: 'password',
      firstname: 'John',
      name: 'Doe',
    });
    const { id: secondUserId } = await createUser({
      connection,
      email: 'bis.' + email,
      password: 'password',
      firstname: 'John',
      name: 'Doe',
    });

    token = firstUserToken;
    userId = firstUserId;
    userIdBis = secondUserId;
  });

  describe('PUT /todos/:id', () => {
    describe('Update a todo with different fields', () => {
      it('should update a todo with all fields', async () => {
        const todoId = await createTodo({
          ...defaultTodo,
          connection,
          userId,
        });

        const response = await agent
          .put(`/todos/${todoId}`)
          .send({
            title: 'Test Todo Updated',
            description: 'Test Description Updated',
            due_time: '2022-04-04 20:30:00',
            status: 'in progress',
          })
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
          id: todoId,
          title: 'Test Todo Updated',
          description: 'Test Description Updated',
          due_time: '2022-04-04 20:30:00',
          user_id: userId,
          status: 'in progress',
          created_at: expect.any(String),
        });

        await deleteTodo(connection, todoId);
      });

      it('should update a todo with only the title', async () => {
        const todoId = await createTodo({
          ...defaultTodo,
          connection,
          userId,
        });

        const response = await agent
          .put(`/todos/${todoId}`)
          .send({
            title: 'Test Todo Updated',
          })
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.title).toBe('Test Todo Updated');

        await deleteTodo(connection, todoId);
      });

      it('should update a todo with only the description', async () => {
        const todoId = await createTodo({
          ...defaultTodo,
          connection,
          userId,
        });

        const response = await agent
          .put(`/todos/${todoId}`)
          .send({
            description: 'Test Description Updated',
          })
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.description).toBe('Test Description Updated');

        await deleteTodo(connection, todoId);
      });

      it('should update a todo with only the due_time', async () => {
        const todoId = await createTodo({
          ...defaultTodo,
          connection,
          userId,
        });

        const response = await agent
          .put(`/todos/${todoId}`)
          .send({
            due_time: '2022-04-04 20:30:00',
          })
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.due_time).toBe('2022-04-04 20:30:00');

        await deleteTodo(connection, todoId);
      });

      describe('Update todo status', () => {
        const statuses = ['not started', 'todo', 'in progress', 'done'];

        statuses.forEach((status) => {
          it(`should update a todo with status '${status}'`, async () => {
            const todoId = await createTodo({
              ...defaultTodo,
              connection,
              userId,
            });

            const response = await agent
              .put(`/todos/${todoId}`)
              .send({
                status,
              })
              .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.status).toBe(status);

            await deleteTodo(connection, todoId);
          });
        });
      });
    });

    describe('Bad request errors', () => {
      it('should throw a bad request error if the body is empty', async () => {
        const todoId = await createTodo({
          ...defaultTodo,
          connection,
          userId,
        });

        const response = await agent
          .put(`/todos/${todoId}`)
          .send({})
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body.msg).toBe('Bad parameter');

        await deleteTodo(connection, todoId);
      });

      it('should throw a bad request error if no body is provided', async () => {
        const todoId = await createTodo({
          ...defaultTodo,
          connection,
          userId,
        });

        const response = await agent
          .put(`/todos/${todoId}`)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body.msg).toBe('Bad parameter');

        await deleteTodo(connection, todoId);
      });

      it('should throw a bad request error if extra fields are provided', async () => {
        const todoId = await createTodo({
          ...defaultTodo,
          connection,
          userId,
        });

        const response = await agent
          .put(`/todos/${todoId}`)
          .send({
            id: 1,
          })
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body.msg).toBe('Bad parameter');

        await deleteTodo(connection, todoId);
      });
    });

    it('should throw an unauthorized error if no token is provided', async () => {
      const todoId = await createTodo({
        ...defaultTodo,
        connection,
        userId,
      });

      const response = await agent.put(`/todos/${todoId}`).send({
        title: 'Test Todo Updated',
      });

      expect(response.status).toBe(401);
      expect(response.body.msg).toBe('No token, authorization denied');

      await deleteTodo(connection, todoId);
    });

    it('should throw an unauthorized error if invalid token is provided', async () => {
      const todoId = await createTodo({
        ...defaultTodo,
        connection,
        userId,
      });

      const response = await agent
        .put(`/todos/${todoId}`)
        .set('Authorization', `Bearer invalid-token`)
        .send({
          title: 'Test Todo Updated',
        });

      expect(response.status).toBe(401);
      expect(response.body.msg).toBe('Invalid token');

      await deleteTodo(connection, todoId);
    });

    it('should throw a bad request error if the id is not a number', async () => {
      const response = await agent.put(`/todos/not-a-number`).send({
        title: 'Test Todo Updated',
      });

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe('Bad parameter');
    });

    it('should throw a bad request error if the id is negative', async () => {
      const response = await agent.put(`/todos/-1`).send({
        title: 'Test Todo Updated',
      });

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe('Bad parameter');
    });

    it('should throw a not found error if the todo does not exist', async () => {
      const response = await agent
        .put(`/todos/999999`)
        .send({
          title: 'Test Todo Updated',
        })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.msg).toBe('Not found');
    });

    it('should throw an unauthorized error if the todo does not belong to the user', async () => {
      const todoId = await createTodo({
        ...defaultTodo,
        connection,
        userId: userIdBis,
      });

      const response = await agent
        .put(`/todos/${todoId}`)
        .send({
          title: 'Test Todo Updated',
        })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(401);
      expect(response.body.msg).toBe('No token, authorization denied');

      await deleteTodo(connection, todoId);
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
