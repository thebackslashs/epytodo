import { toast } from 'sonner';
import { formatDate } from '../../lib/utils';
import { CreateTodoPayload, TodoInput, TodoStatus } from './types';

export const handleServerError = (
  response: { serverError?: string } | undefined
): boolean => {
  if (response?.serverError) {
    toast.error(response.serverError);
    return true;
  }
  return false;
};

export const handleValidationError = (
  response: { validationErrors?: Record<string, unknown> } | undefined
): boolean => {
  if (response?.validationErrors) {
    toast.error('Cannot create todo, please try again later.');
    return true;
  }
  return false;
};

export const createTodoPayload = (todo: TodoInput): CreateTodoPayload => ({
  status: todo.status === 'draft' ? 'not started' : (todo.status as TodoStatus),
  description: todo.description || 'This is a example description',
  due_time: todo.due_time || formatDate(new Date()),
  title: todo.title || 'Title Example',
});
