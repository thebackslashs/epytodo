import { DragEndEvent, DragMoveEvent, DragStartEvent } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { TodoStatus } from "../types/todo";

interface UseDragHandlersProps {
  columnIds: string[];
  updateTodoStatus: (todoId: number, status: TodoStatus) => void;
}

export function useDragHandlers({
  columnIds,
  updateTodoStatus,
}: UseDragHandlersProps) {
  const [activeTodoId, setActiveTodoId] = useState<number | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<TodoStatus | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTodoId(event.active.id as number);
  };

  const handleDragEnd = () => {
    if (activeTodoId && activeColumnId) {
      updateTodoStatus(activeTodoId, activeColumnId as TodoStatus);
    }
    setActiveTodoId(null);
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const { collisions } = event;
    const columnId = collisions?.find((collision) =>
      columnIds.includes(collision.id as string)
    )?.id;
    if (columnId) {
      setActiveColumnId(columnId as TodoStatus);
    }
  };

  const handlers = {
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
    onDragMove: handleDragMove,
  };

  return {
    activeTodoId,
    activeColumnId,
    handlers,
  };
}
