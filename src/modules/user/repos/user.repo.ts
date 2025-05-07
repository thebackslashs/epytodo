import { User } from '@/modules/user/models/user.model';
import { Inject, Injectable } from '@/core';
import { DatabaseService } from '@/modules/database/database.service';

@Injectable()
class UserRepo {
  constructor(
    @Inject('DatabaseService') private readonly db: DatabaseService
  ) {}

  async create(data: Omit<User, 'id' | 'created_at'>): Promise<User> {
    await this.db.query(
      `INSERT INTO user (name, firstname, email, password) VALUES (?, ?, ?, ?)`,
      [data.name, data.firstname, data.email, data.password]
    );

    const user = await this.findBy({ email: data.email });
    return user[0];
  }

  async update(id: number, data: Omit<Partial<User>, 'id'>): Promise<User> {
    const [rows] = await this.db.query(
      `UPDATE user SET ${Object.entries(data)
        .map(([key]) => `${key} = ?`)
        .join(', ')} WHERE id = ?`,
      [...Object.entries(data).map(([, value]) => value), id]
    );
    return (rows as User[])[0];
  }

  async findBy(data: Partial<User>): Promise<User[]> {
    const [rows] = await this.db.query(
      `SELECT * FROM user WHERE ${Object.keys(data)
        .map((key) => `${key} = ?`)
        .join(' AND ')}`,
      Object.values(data)
    );
    return rows as User[];
  }

  async findAll(): Promise<User[]> {
    const [rows] = await this.db.query('SELECT * FROM user');
    return rows as User[];
  }

  async deleteBy(data: Partial<User>): Promise<void> {
    await this.db.query(
      `DELETE FROM user WHERE ${Object.keys(data)
        .map((key) => `${key} = ?`)
        .join(' AND ')}`,
      Object.values(data)
    );
  }
}

export default UserRepo;
