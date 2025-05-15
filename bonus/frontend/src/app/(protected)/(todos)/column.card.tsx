import { useDroppable } from '@dnd-kit/core';
import { Card } from '@/src/components/ui/card';
import { DraggableTodoCard } from './todo.draggable';
import { cn } from '@/src/lib/utils';
import { PossibleDraftTodo } from './draft.type';

interface ColumnProps {
  title: string;
  id: string;
  todos: PossibleDraftTodo[];
  isActive?: boolean;
  icon: React.ReactNode;
}

const EmptyColumn = () => (
  <div className="h-full flex items-center justify-center text-muted-foreground">
    Drop here
  </div>
);

const TodoList = ({ todos }: Pick<ColumnProps, 'todos'>) => (
  <>
    {todos.map((todo) => (
      <DraggableTodoCard
        key={todo.id}
        id={todo.id}
        title={todo.title ?? ''}
        description={todo.description ?? ''}
        status={todo.status}
      />
    ))}
  </>
);

export function Column({ title, id, todos, isActive, icon }: ColumnProps) {
  const { setNodeRef } = useDroppable({ id });
  const isEmpty = todos.length === 0;

  return (
    <Card
      className={cn(
        'col-span-1 p-4 transition-colors w-full max-w-sm',
        isActive && 'bg-muted/20'
      )}
    >
      <h2 className="text-xl font-semibold mb-4 capitalize flex items-center gap-2">
        {icon}
        {title}
      </h2>
      <div
        ref={setNodeRef}
        className={cn(
          'space-y-4 min-h-[200px] h-full transition-colors',
          isEmpty &&
            'bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/20'
        )}
      >
        {isEmpty ? <EmptyColumn /> : <TodoList todos={todos} />}
      </div>
    </Card>
  );
}
