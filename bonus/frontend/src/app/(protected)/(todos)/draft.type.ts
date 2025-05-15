import { Todo } from 'epytodo-sdk';

export type PossibleDraftTodo = Omit<Todo, 'id' | 'status' | 'created_at'> & {
  id: number;
  created_at: string;
  status: Todo['status'] | 'draft';
};
