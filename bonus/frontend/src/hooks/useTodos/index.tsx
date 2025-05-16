/* eslint-disable max-lines-per-function */

import { useState } from 'react';
import {
  DRAFT_ID,
  DRAFT_STATUS,
  PossibleDraftTodo,
  TodoInput,
  TodoStatus,
} from './types';
import createTodoAction from '../../actions/todos/create.action';
import { formatDate } from '../../lib/utils';
import updateTodoAction from '../../actions/todos/update.action';
import {
  createTodoPayload,
  handleServerError,
  handleValidationError,
} from './utils';
import { showStatusUpdateToast } from './toast';

export { DRAFT_ID, DRAFT_STATUS, DRAFT_DROP_ZONE_ID } from './types';
export type { TodoStatus, TodoInput, PossibleDraftTodo } from './types';

export function useTodos(defaultTodos: PossibleDraftTodo[]) {
  const [todos, setTodos] = useState<PossibleDraftTodo[]>(defaultTodos);

  const addDraft = (todo: TodoInput) => {
    if (!todo?.title?.trim()) {
      return;
    }

    const draft = {
      ...todo,
      id: DRAFT_ID,
      created_at: new Date().toISOString(),
    };

    setTodos([...todos.filter((t) => t.id !== DRAFT_ID), draft]);
  };

  const removeTodo = (todoId: number) => {
    setTodos(todos.filter((t) => t.id !== todoId));
  };

  const appendDraft = async (todo: PossibleDraftTodo) => {
    const res = await createTodoAction(createTodoPayload(todo));

    if (handleValidationError(res) || handleServerError(res)) {
      return;
    }

    if (res?.data) {
      const newTodo: PossibleDraftTodo = {
        id: res.data.id ?? DRAFT_ID,
        created_at: res.data.created_at ?? new Date().toISOString(),
        status: res.data.status ?? 'not started',
        title: res.data.title ?? '',
        description: res.data.description ?? '',
        due_time: res.data.due_time ?? formatDate(new Date()),
      };
      setTodos([...todos.map((t) => (t.id === DRAFT_ID ? newTodo : t))]);
    }
  };

  const updateTodoStatus = async (
    id: number,
    status: TodoStatus | 'draft' | undefined
  ) => {
    if (!status) {
      return;
    }
    const todo = todos.find((todo) => todo.id === id);
    if (!todo) {
      return;
    }

    const previousStatus = todo?.status as TodoStatus;
    if (
      previousStatus === status ||
      (status === DRAFT_STATUS && id !== DRAFT_ID)
    ) {
      return;
    }

    if (id === DRAFT_ID) {
      appendDraft({ ...todo, status });
      return;
    }

    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, status } : todo))
    );

    const res = await updateTodoAction({
      id,
      status: status === 'draft' ? 'not started' : status,
    });

    if (handleValidationError(res) || handleServerError(res)) {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, status: previousStatus } : todo
        )
      );
      return;
    }

    showStatusUpdateToast(
      todo,
      id,
      status === 'draft' ? 'not started' : status,
      previousStatus,
      todos,
      setTodos
    );
  };

  return {
    todos,
    setTodos,
    addDraft,
    removeTodo,
    updateTodoStatus,
  };
}
