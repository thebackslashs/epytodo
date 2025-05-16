import { DragMoveEvent, DragStartEvent } from '@dnd-kit/core';
import { useState } from 'react';
import type { PossibleDraftTodo } from './useTodos';

interface UseDragHandlersProps {
  columnIds: string[];
  updateTodoStatus: (
    todoId: number,
    status: PossibleDraftTodo['status']
  ) => void;
}

export function useDragHandlers({
  columnIds,
  updateTodoStatus,
}: UseDragHandlersProps) {
  const [activeTodoId, setActiveTodoId] = useState<number | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<
    PossibleDraftTodo['status'] | null
  >(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTodoId(event.active.id as number);
  };

  const handleDragEnd = () => {
    if (activeTodoId && activeColumnId) {
      updateTodoStatus(activeTodoId, activeColumnId);
    }
    setActiveTodoId(null);
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const { collisions } = event;
    const columnId = collisions?.find((collision) =>
      columnIds.includes(collision.id as string)
    )?.id;
    if (columnId) {
      setActiveColumnId(columnId as PossibleDraftTodo['status']);
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
