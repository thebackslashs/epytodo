import { Inject, Injectable } from '@/core';
import { TodoRepo } from '../repos/todo.repo';
import { Todo } from '../models/todo.model';
import { InferCreateTodoDTO } from '../dtos/create-todo.dto';
import { InferUpdateTodoDTO } from '../dtos/update-todo.dto';

@Injectable()
export class TodoService {
  constructor(@Inject('TodoRepo') private readonly todoRepo: TodoRepo) {}

  async createTodo(todoData: InferCreateTodoDTO): Promise<Todo> {
    const parsedData = {
      ...todoData,
      due_time: new Date(todoData.due_time)
    };
    return this.todoRepo.create(parsedData);
  }

  async updateTodo(id: number, todoData: InferUpdateTodoDTO): Promise<Todo> {
    const { due_time, ...rest } = todoData;
    
    const parsedData = {
      ...rest,
      ...(due_time ? { due_time: new Date(due_time) } : {})
    };
    
    return this.todoRepo.update(id, parsedData);
  }
}