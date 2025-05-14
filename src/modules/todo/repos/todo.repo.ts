import { Inject, Injectable } from '@/core';
import { DatabaseService } from '@/modules/database/database.service';
import { Todo } from '../models/todo.model';

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
    return (rows as Todo[])[0];
  }
}
