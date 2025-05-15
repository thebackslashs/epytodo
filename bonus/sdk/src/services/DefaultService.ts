/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Todo } from '../models/Todo';
import type { Token } from '../models/Token';
import type { User } from '../models/User';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
  /**
   * Register a new user
   * @param requestBody
   * @returns Token User registered
   * @throws ApiError
   */
  public static postRegister(requestBody: {
    email: string;
    password: string;
    firstname: string;
    name: string;
  }): CancelablePromise<Token> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/register',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Account already exists or bad parameter`,
        500: `Internal server error`,
      },
    });
  }
  /**
   * Log in a user
   * @param requestBody
   * @returns Token Successful login
   * @throws ApiError
   */
  public static postLogin(requestBody: {
    email: string;
    password: string;
  }): CancelablePromise<Token> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/login',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad parameters`,
        401: `Invalid credentials`,
        500: `Internal server error`,
      },
    });
  }
  /**
   * Get current user information
   * @returns User User data
   * @throws ApiError
   */
  public static getUser(): CancelablePromise<User> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/user',
      errors: {
        401: `Unauthorized - No token or invalid token`,
        500: `Internal server error`,
      },
    });
  }
  /**
   * Get all todos for the logged-in user
   * @returns Todo List of user todos
   * @throws ApiError
   */
  public static getUserTodos(): CancelablePromise<Array<Todo>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/user/todos',
      errors: {
        401: `Unauthorized - No token or invalid token`,
        500: `Internal server error`,
      },
    });
  }
  /**
   * Get a user by ID or email
   * @param identifier
   * @returns User User data
   * @throws ApiError
   */
  public static getUsers(identifier: string): CancelablePromise<User> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/users/{identifier}',
      path: {
        identifier: identifier,
      },
      errors: {
        401: `Unauthorized - No token or invalid token`,
        404: `Resource not found`,
        500: `Internal server error`,
      },
    });
  }
  /**
   * Update user information
   * @param id
   * @param requestBody
   * @returns void
   * @throws ApiError
   */
  public static putUsers(id: number, requestBody: any): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/users/{id}',
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad parameters`,
        401: `Unauthorized - No token or invalid token`,
        404: `Resource not found`,
        500: `Internal server error`,
      },
    });
  }
  /**
   * Delete a user
   * @param id
   * @returns void
   * @throws ApiError
   */
  public static deleteUsers(id: number): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/users/{id}',
      path: {
        id: id,
      },
      errors: {
        401: `Unauthorized - No token or invalid token`,
        404: `Resource not found`,
        500: `Internal server error`,
      },
    });
  }
  /**
   * Get all todos
   * @returns Todo List of todos
   * @throws ApiError
   */
  public static getTodos(): CancelablePromise<Array<Todo>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/todos',
      errors: {
        401: `Unauthorized - No token or invalid token`,
        500: `Internal server error`,
      },
    });
  }
  /**
   * Create a new todo
   * @param requestBody
   * @returns Todo Created todo
   * @throws ApiError
   */
  public static postTodos(requestBody: any): CancelablePromise<Todo> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/todos',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad parameters`,
        401: `Unauthorized - No token or invalid token`,
        500: `Internal server error`,
      },
    });
  }
  /**
   * Get a todo by ID
   * @param id
   * @returns Todo A todo
   * @throws ApiError
   */
  public static getTodos1(id: number): CancelablePromise<Todo> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/todos/{id}',
      path: {
        id: id,
      },
      errors: {
        401: `Unauthorized - No token or invalid token`,
        404: `Resource not found`,
        500: `Internal server error`,
      },
    });
  }
  /**
   * Update a todo
   * @param id
   * @param requestBody
   * @returns void
   * @throws ApiError
   */
  public static putTodos(id: number, requestBody: any): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/todos/{id}',
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad parameters`,
        401: `Unauthorized - No token or invalid token`,
        404: `Resource not found`,
        500: `Internal server error`,
      },
    });
  }
  /**
   * Delete a todo
   * @param id
   * @returns void
   * @throws ApiError
   */
  public static deleteTodos(id: number): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/todos/{id}',
      path: {
        id: id,
      },
      errors: {
        401: `Unauthorized - No token or invalid token`,
        404: `Resource not found`,
        500: `Internal server error`,
      },
    });
  }
}
