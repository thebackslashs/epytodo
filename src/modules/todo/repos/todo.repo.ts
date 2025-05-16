import { Inject, Injectable } from '@/core';
import { DatabaseService } from '@/modules/database/database.service';
import { Todo } from '../models/todo.model';
import { formatDate } from '@/lib/dates';

@Injectable()
export class TodoRepo {
  constructor(
    @Inject('DatabaseService') private readonly db: DatabaseService
  ) {}

  async create(data: Omit<Todo, 'id' | 'created_at'>): Promise<Todo> {
    await this.db.query(
      `INSERT INTO todo (title, description, due_time, status, user_id)
       VALUES (?, ?, ?, ?, ?)`,
      [data.title, data.description, data.due_time, data.status, data.user_id]
    );

    const [rows] = await this.db.query(
      'SELECT * FROM todo WHERE id = LAST_INSERT_ID()'
    );

    const todo = (rows as Todo[])[0];

    return {
      ...todo,
      created_at: formatDate(new Date(todo.created_at)),
      due_time: formatDate(new Date(todo.due_time)),
    };
  }

  async findAll(): Promise<Todo[]> {
    const [rows] = await this.db.query('SELECT * FROM todo');
    return (rows as Todo[]).map((row) => ({
      ...row,
      created_at: formatDate(new Date(row.created_at)),
      due_time: formatDate(new Date(row.due_time)),
    }));
  }

  async findAllByUserId(userId: number): Promise<Todo[]> {
    const [rows] = await this.db.query('SELECT * FROM todo WHERE user_id = ?', [
      userId,
    ]);

    return (rows as Todo[]).map((row) => ({
      ...row,
      created_at: formatDate(new Date(row.created_at)),
      due_time: formatDate(new Date(row.due_time)),
    }));
  }
}
