import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TodoCard } from "./todo.card";
import { Todo } from "@/types/todo";
import { useTodo } from "@/stores/ActiveTodoContext";
import { cn } from "@/lib/utils";

interface DraggableTodoCardProps {
  id: number;
  title: string;
  description?: string;
  status: Todo["status"];
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
      className={cn(active ? "pointer-events-none" : "cursor-grab")}
    >
      <TodoCard
        title={title}
        description={description}
        completed={status === "done"}
      />
    </div>
  );
}
