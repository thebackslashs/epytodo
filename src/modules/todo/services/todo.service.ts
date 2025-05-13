import { Inject, Injectable } from '@/core';
import { TodoRepo } from '../repos/todo.repo';
import { Todo } from '../models/todo.model';

@Injectable()
export class TodoService {
  constructor(@Inject('TodoRepo') private readonly todoRepo: TodoRepo) {}

  async createTodo(todoData: Omit<Todo, 'id' | 'created_at'>): Promise<Todo> {
    return this.todoRepo.create(todoData);
  }
}