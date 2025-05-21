import { Inject, Injectable } from '@/core';
import { TodoRepo } from '../repos/todo.repo';
import { Todo } from '../models/todo.model';
import { InferCreateTodoDTO } from './../dtos/create-todo.dto';
import { NotFoundError } from '../errors/not-found.error';
import { NotAutorizedError } from '../errors/not-autorized.error';
import { BadParameterError } from '../errors/bad-parameter.error';

@Injectable('TodoService')
export class TodoService {
  constructor(@Inject('TodoRepo') private readonly todoRepo: TodoRepo) {}

  async createTodo(todoData: InferCreateTodoDTO): Promise<Todo> {
    return this.todoRepo.create(todoData);
  }

  async getTodos(): Promise<Todo[]> {
    return this.todoRepo.findAll();
  }

  async getTodosByUserId(userId: number): Promise<Todo[]> {
    return this.todoRepo.findAllByUserId(userId);
  }

  async getTodoById(id: number): Promise<Todo> {
    const todo = await this.todoRepo.findOneBy({ id });

    if (!todo) {
      throw new NotFoundError();
    }

    return todo;
  }

  async getUserTodoById(id: number, userId: number): Promise<Todo> {
    const todo = await this.todoRepo.findOneBy({ id });

    if (!todo) {
      throw new NotFoundError();
    }

    if (todo.user_id !== userId) {
      throw new NotAutorizedError();
    }

    return todo;
  }

  async updateTodoById(
    fields: Partial<Omit<Todo, 'id' | 'created_at'>>,
    id: number
  ): Promise<Todo> {
    return this.todoRepo.updateOneBy(fields, id);
  }

  async updateUserTodoById(
    fields: Partial<Omit<Todo, 'id' | 'created_at'>>,
    id: number,
    userId: number
  ): Promise<Todo> {
    const todo = await this.todoRepo.findOneBy({ id });

    if (Object.keys(fields).length === 0) {
      throw new BadParameterError();
    }

    if (!todo) {
      throw new NotFoundError();
    }

    if (todo.user_id !== userId) {
      throw new NotAutorizedError();
    }

    return this.todoRepo.updateOneBy(fields, id);
  }

  async deleteTodoById(id: number): Promise<void> {
    await this.todoRepo.deleteOneBy({ id });
  }

  async deleteUserTodoById(
    id: number,
    userId: number
  ): Promise<{ msg: string }> {
    const todo = await this.todoRepo.findOneBy({ id });

    if (!todo) {
      throw new NotFoundError();
    }

    if (todo.user_id !== userId) {
      throw new NotAutorizedError();
    }

    await this.todoRepo.deleteOneBy({ id, user_id: userId });

    return { msg: 'Successfully deleted record number: ' + id };
  }
}
