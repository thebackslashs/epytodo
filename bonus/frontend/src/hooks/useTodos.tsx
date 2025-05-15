import { useState } from 'react';
import { Todo } from 'epytodo-sdk';
import { toast } from 'sonner';
import { Button } from '@/src/components/ui/button';
import { CheckIcon } from 'lucide-react';
import { PossibleDraftTodo } from '../app/(protected)/(todos)/draft.type';

export const DRAFT_ID = -1;
export const DRAFT_STATUS = 'draft';
export const DRAFT_DROP_ZONE_ID = 'draft';

export function useTodos(defaultTodos: PossibleDraftTodo[]) {
  const [todos, setTodos] = useState<PossibleDraftTodo[]>(defaultTodos);

  const addTodo = (todo: Omit<PossibleDraftTodo, 'id' | 'created_at'>) => {
    if (todo?.title?.trim()) {
      setTodos([
        ...todos,
        {
          ...todo,
          id: Date.now(),
          created_at: new Date().toISOString(),
          status: 'not started',
        },
      ]);
    }
  };

  const addDraft = (todo: Omit<PossibleDraftTodo, 'id' | 'created_at'>) => {
    const draft = {
      ...todo,
      id: DRAFT_ID,
      created_at: new Date().toISOString(),
    };

    if (draft?.title?.trim()) {
      setTodos([...todos.filter((t) => t.id !== DRAFT_ID), draft]);
    }
  };

  const removeTodo = (todoId: number) => {
    setTodos(todos.filter((t) => t.id !== todoId));
  };

  const appendDraft = (todo: PossibleDraftTodo) => {
    const newTodo = {
      ...todo,
      id: Date.now(),
      created_at: new Date().toISOString(),
    };

    setTodos([...todos.map((t) => (t.id === DRAFT_ID ? newTodo : t))]);
  };

  const updateTodoStatus = (
    id: number,
    status: PossibleDraftTodo['status']
  ) => {
    const todo = todos.find((todo) => todo.id === id);
    if (!todo) {
      return;
    }

    const previousStatus: PossibleDraftTodo['status'] = todo?.status;
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

    const toastId = `todo-status-updated-${id}-${status}-${previousStatus}-${Date.now()}`;

    toast.success(
      () => {
        function handleUndo() {
          setTodos(
            todos.map((todo) =>
              todo.id === id ? { ...todo, status: previousStatus } : todo
            )
          );
          toast.dismiss(toastId);
        }

        return (
          <div className="flex items-center gap-6 w-[300px] pl-1 font-mono">
            <p className={'text-sm  font-medium'}>
              Updated{' '}
              <span className="font-medium">&quot;{todo.title}&quot;</span>{' '}
              status to {status}
            </p>
            <Button
              className="ml-auto"
              variant="outline"
              size="sm"
              onClick={handleUndo}
            >
              Undo
            </Button>
          </div>
        );
      },
      {
        id: toastId,
        duration: 3000,
        icon: (
          <CheckIcon className="w-5 h-5 stroke-3 text-white bg-primary rounded-full p-[5px]" />
        ),
      }
    );
  };

  return {
    todos,
    setTodos,
    addTodo,
    addDraft,
    removeTodo,
    updateTodoStatus,
  };
}
