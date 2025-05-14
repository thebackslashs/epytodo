"use client";

import { TodoCard } from "@/app/(protected)/(todos)/todo.card";
import {
  DndContext,
  DragOverlay,
  defaultDropAnimation,
  rectIntersection,
} from "@dnd-kit/core";
import { Column } from "./column.card";
import { Todo, TodoStatus } from "@/types/todo";
import { DRAFT_DROP_ZONE_ID, DRAFT_ID, useTodos } from "@/hooks/useTodos";
import { useDragHandlers } from "@/hooks/useDragHandlers";
import { CreateTodoForm } from "./create-todo.form";
import { cn } from "@/lib/utils";
import { ActiveTodoProvider } from "@/stores/ActiveTodoContext";
import {
  CircleIcon,
  ClockIcon,
  CheckCircle2Icon,
  PlayCircleIcon,
} from "lucide-react";

type TodoListProps = {
  todos: Todo[];
};

const columnsIcons = {
  "not started": <CircleIcon className="w-4 h-4" />,
  todo: <ClockIcon className="w-4 h-4" />,
  "in progress": <PlayCircleIcon className="w-4 h-4" />,
  done: <CheckCircle2Icon className="w-4 h-4" />,
};

const columnIds = ["not started", "todo", "in progress", "done"];
type ColumnId = (typeof columnIds)[number];

function getTodoById(todos: Todo[], id: number) {
  return todos.find((todo) => todo.id === id);
}

function copyTodos(todos: Todo[]) {
  return todos.map((todo) => ({
    ...todo,
  }));
}

function getColumns(
  originalTodos: Todo[],
  activeTodoId: number | null,
  activeColumnId: ColumnId | null
) {
  const todos = copyTodos(originalTodos);

  if (activeTodoId) {
    const activeTodo = todos.find((todo) => todo.id == activeTodoId);

    if (activeTodo) {
      activeTodo.status = activeColumnId as TodoStatus;
    }
  }

  const columns = Object.fromEntries(
    columnIds.map((status) => [
      status,
      todos
        .filter((todo) => todo.status === status)
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ),
    ])
  ) as Record<ColumnId, Todo[]>;

  return columns;
}

export default function TodoList({ todos: defaultTodos }: TodoListProps) {
  const { todos, updateTodoStatus, addDraft } = useTodos(defaultTodos);

  const { activeTodoId, activeColumnId, handlers } = useDragHandlers({
    columnIds: [...columnIds, DRAFT_DROP_ZONE_ID],
    updateTodoStatus,
  });

  const draftIsPresent = todos.some((todo) => todo.id === DRAFT_ID);
  const activeTodo =
    activeTodoId != 0 && activeTodoId != null
      ? getTodoById(todos, activeTodoId)
      : null;

  const columns = getColumns(todos, activeTodoId, activeColumnId);

  return (
    <ActiveTodoProvider activeTodoId={activeTodoId}>
      <div
        className={cn("min-h-screen p-8", activeTodoId && "cursor-grabbing")}
      >
        <div className="max-w-7xl mx-auto space-y-6">
          <h1 className="text-4xl font-bold text-center mb-2 mt-8">Epytodo</h1>
          <h3 className="text-sm text-muted-foreground text-center mb-8">
            Almost as good as Github Projects.
          </h3>

          <DndContext {...handlers} collisionDetection={rectIntersection}>
            <div className="mx-auto w-full max-w-md">
              <CreateTodoForm
                addDraft={addDraft}
                draftIsPresent={draftIsPresent}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 justify-items-center">
              {columnIds.map((status) => (
                <Column
                  key={status}
                  id={status}
                  title={`${status} (${columns[status].length})`}
                  todos={columns[status]}
                  isActive={activeColumnId === status}
                  icon={columnsIcons[status as keyof typeof columnsIcons]}
                />
              ))}
            </div>

            <DragOverlay dropAnimation={defaultDropAnimation}>
              {activeTodo && (
                <TodoCard
                  {...activeTodo}
                  completed={activeTodo.status === "done"}
                  className="rotate-3 cursor-grabbing"
                />
              )}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </ActiveTodoProvider>
  );
}
