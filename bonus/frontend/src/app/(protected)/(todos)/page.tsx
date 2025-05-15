import { Metadata } from 'next';
import TodoList from './page.client';
import { Todo } from 'epytodo-sdk';

export const metadata: Metadata = {
  title: 'Todo List',
  description: 'Manage your tasks',
};

const initialTodos: Todo[] = [
  {
    id: 1,
    title: 'Learn Next.js',
    description: 'Study Next.js documentation',
    status: 'not started',
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Build a Todo App',
    description: 'Create a todo app with shadcn',
    status: 'in progress',
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    id: 3,
    title: 'Deploy the app',
    description: 'Deploy to production',
    status: 'done',
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  },
] as const;

export default function Home() {
  return <TodoList todos={initialTodos} />;
}
