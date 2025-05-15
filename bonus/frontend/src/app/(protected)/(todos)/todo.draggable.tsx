import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TodoCard } from './todo.card';
import { PossibleDraftTodo } from './draft.type';
import { useTodo } from '@/src/stores/ActiveTodoContext';
import { cn } from '@/src/lib/utils';

interface DraggableTodoCardProps {
  id: number;
  title: string;
  description?: string;
  status: PossibleDraftTodo['status'];
}

const useDraggableStyle = (id: number) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return {
    ref: setNodeRef,
    style: {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    },
    ...attributes,
    ...listeners,
  };
};

export function DraggableTodoCard({
  id,
  title,
  description,
  status,
}: DraggableTodoCardProps) {
  const draggableProps = useDraggableStyle(id);
  const { active } = useTodo(id);

  return (
    <div
      {...draggableProps}
      className={cn(active ? 'pointer-events-none' : 'cursor-grab')}
    >
      <TodoCard
        title={title}
        description={description}
        completed={status === 'done'}
      />
    </div>
  );
}
