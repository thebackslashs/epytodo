import { Todo } from 'epytodo-sdk';

export const DRAFT_ID = -1;
export const DRAFT_STATUS = 'draft';
export const DRAFT_DROP_ZONE_ID = 'draft';

export type PossibleDraftTodo = Omit<Todo, 'id' | 'status' | 'created_at'> & {
  id: number;
  created_at: string;
  status: Todo['status'] | 'draft';
};

export type TodoStatus = 'not started' | 'todo' | 'in progress' | 'done';
export type TodoInput = Omit<PossibleDraftTodo, 'id' | 'created_at'>;

export interface CreateTodoPayload {
  status: TodoStatus;
  description: string;
  due_time: string;
  title: string;
}
