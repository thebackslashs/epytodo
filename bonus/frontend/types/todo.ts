export type TodoStatus =
  | "draft"
  | "not started"
  | "todo"
  | "in progress"
  | "done";

export interface Todo {
  id: number;
  title: string;
  description: string;
  status: TodoStatus;
  created_at: string;
}

export interface TodoCardProps extends Todo {
  completed: boolean;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export interface ColumnProps {
  title: string;
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  isActive: boolean;
}
