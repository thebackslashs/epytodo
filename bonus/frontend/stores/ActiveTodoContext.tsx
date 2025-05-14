import { createContext, useContext, ReactNode, useState } from "react";

interface ActiveTodoContextType {
  activeTodoId: number | null;
}

const ActiveTodoContext = createContext<ActiveTodoContextType | undefined>(
  undefined
);

interface ActiveTodoProviderProps {
  children: ReactNode;
  activeTodoId: number | null;
}

export function ActiveTodoProvider({
  children,
  activeTodoId,
}: ActiveTodoProviderProps) {
  return (
    <ActiveTodoContext.Provider value={{ activeTodoId }}>
      {children}
    </ActiveTodoContext.Provider>
  );
}

export function useTodo(id: number) {
  const context = useContext(ActiveTodoContext);

  if (context === undefined) {
    throw new Error("useActiveTodo must be used within an ActiveTodoProvider");
  }

  return {
    activeTodoId: context.activeTodoId,
    active: context.activeTodoId === id,
  };
}
