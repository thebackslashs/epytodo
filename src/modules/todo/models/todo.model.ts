export interface Todo {
  id: number;
  title: string;
  description: string;
  created_at: string;
  due_time: string;
  status: 'not started' | 'todo' | 'in progress' | 'done';
  user_id: number;
}
