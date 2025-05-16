import { Metadata } from 'next';
import TodoList from './page.client';
import { getUserTodos } from 'epytodo-sdk';
import { getSession } from '@/src/hooks/getSession';
import { PossibleDraftTodo } from '@/src/hooks/useTodos';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Todo List',
  description: 'Manage your tasks',
};

export default async function Home() {
  const { token } = await getSession({ redirectTo: '/login' });

  const todos = await getUserTodos({
    auth: token,
  });

  if (todos.error) {
    console.error(todos.error);
    redirect('/error');
  }

  return <TodoList todos={todos.data as PossibleDraftTodo[]} />;
}
