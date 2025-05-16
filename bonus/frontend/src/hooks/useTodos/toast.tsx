import { toast } from 'sonner';
import { Button } from '@/src/components/ui/button';
import { CheckIcon } from 'lucide-react';
import { PossibleDraftTodo, TodoStatus } from './types';
import updateTodoAction from '../../actions/todos/update.action';
import { handleServerError, handleValidationError } from './utils';

export const showStatusUpdateToast = (
  todo: PossibleDraftTodo,
  id: number,
  status: TodoStatus,
  previousStatus: TodoStatus,
  todos: PossibleDraftTodo[],
  setTodos: (todos: PossibleDraftTodo[]) => void
) => {
  const toastId = `todo-status-updated-${id}-${status}-${previousStatus}-${Date.now()}`;

  toast.success(
    () => {
      async function handleUndo() {
        setTodos(
          todos.map((todo) =>
            todo.id === id ? { ...todo, status: previousStatus } : todo
          )
        );

        const res = await updateTodoAction({
          id,
          status: previousStatus,
        });

        if (handleValidationError(res) || handleServerError(res)) {
          return;
        }

        toast.dismiss(toastId);
      }

      return (
        <div className="flex items-center gap-6 w-[300px] pl-1 font-mono">
          <p className={'text-sm  font-medium'}>
            Updated{' '}
            <span className="font-medium">&quot;{todo.title}&quot;</span> status
            to {status}
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
