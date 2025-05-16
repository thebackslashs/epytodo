import mysql from 'mysql2/promise';
import { Todo } from '@/modules/todo/models/todo.model';
import { User } from '@/modules/user/models/user.model';
import CryptoService from '@/modules/crypto/services/crypto.service';

export const defaultCryptoService = new CryptoService();

export async function createUser({
  connection,
  email,
  password,
  firstname,
  name,
}: {
  connection: mysql.Connection;
  email: string;
  password: string;
  firstname: string;
  name: string;
}): Promise<{ token: string; id: number }> {
  const hashedPassword = await defaultCryptoService.hashPassword(password);
  await connection.query(
    'INSERT INTO user (email, password, firstname, name) VALUES (?, ?, ?, ?)',
    [email, hashedPassword, firstname, name]
  );
  const [rowsUser] = await connection.query(
    'SELECT id FROM user WHERE email = ?',
    [email]
  );
  return {
    token: defaultCryptoService.signToken({
      id: (rowsUser as User[])[0].id,
      email,
      password,
      firstname,
      name,
      created_at: new Date().toISOString(),
    }),
    id: (rowsUser as User[])[0].id,
  };
}

export async function createTodo({
  connection,
  userId,
  title,
  description,
  due_time,
  status,
}: {
  connection: mysql.Connection;
  userId: number;
  title: string;
  description: string;
  due_time: string;
  status: string;
}): Promise<number> {
  await connection.query(
    'INSERT INTO todo (title, description, due_time, user_id, status) VALUES (?, ?, ?, ?, ?)',
    [title, description, due_time, userId, status]
  );
  const [rowsTodo] = await connection.query(
    'SELECT id FROM todo WHERE user_id = ?',
    [userId]
  );
  return (rowsTodo as Todo[])[0].id;
}

export async function deleteTodo(
  connection: mysql.Connection,
  todoId: number
): Promise<void> {
  await connection.query('DELETE FROM todo WHERE id = ?', [todoId]);
}

export async function deleteUser(
  connection: mysql.Connection,
  userId: number
): Promise<void> {
  await connection.query('DELETE FROM user WHERE id = ?', [userId]);
}
