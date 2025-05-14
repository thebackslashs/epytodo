"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Todo } from "@/types/todo";
import { DraggableTodoCard } from "./todo.draggable";
import { Textarea } from "@/components/ui/textarea";
import { useDroppable } from "@dnd-kit/core";
import { DRAFT_DROP_ZONE_ID, DRAFT_ID, DRAFT_STATUS } from "@/hooks/useTodos";

function StepTitle({
  value,
  onChange,
  handleSubmit,
  isActive,
}: {
  value: string;
  onChange: (value: string) => void;
  handleSubmit: () => void;
  isActive: boolean;
}) {
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <div className={cn("flex gap-4", isActive && "opacity-100")}>
      <Input
        placeholder="Add a new todo..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      {isActive && <Button onClick={handleSubmit}>Next</Button>}
    </div>
  );
}

function StepDescription({
  value,
  onChange,
  isActive,
  handleSubmit,
}: {
  value: string;
  onChange: (value: string) => void;
  isActive: boolean;
  handleSubmit: () => void;
}) {
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <div
      className={cn(
        "flex flex-col justify-center gap-4",
        isActive && "opacity-100"
      )}
    >
      <Textarea
        placeholder="Add a new todo..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      {isActive && <Button onClick={handleSubmit}>Submit</Button>}
    </div>
  );
}

type Step = "title" | "description" | "status";

interface CreateTodoFormProps {
  addDraft: (todo: Omit<Todo, "id" | "created_at">) => void;
  draftIsPresent: boolean;
}

const initialTodo: Omit<Todo, "created_at"> = {
  id: DRAFT_ID,
  title: "",
  description: "",
  status: DRAFT_STATUS,
};

export function CreateTodoForm({
  addDraft,
  draftIsPresent,
}: CreateTodoFormProps) {
  const { setNodeRef } = useDroppable({ id: DRAFT_DROP_ZONE_ID });

  const [step, setStep] = useState<Step>("title");
  const [newTodo, setNewTodo] = useState<Omit<Todo, "created_at">>(initialTodo);

  const handleReset = () => {
    setNewTodo(initialTodo);
    setStep("title");
  };

  const handleSubmitDraft = () => {
    const trimmedTodo = newTodo.title.trim();
    if (trimmedTodo) {
      addDraft(newTodo);
    }
  };

  const handleStepBack = useCallback(() => {
    if (step === "description") {
      setStep("title");
    } else if (step === "status") {
      setStep("description");
    }
  }, [step]);

  const handleStepSubmiting = useCallback(() => {
    if (step === "title") {
      setStep("description");
    } else if (step === "description") {
      handleSubmitDraft();
      setStep("status");
    }
  }, [step, handleSubmitDraft]);

  useEffect(() => {
    const isNewTodo = newTodo !== initialTodo;
    const isStatusStep = step === "status";
    const isDraftNotPresent = !draftIsPresent;

    if (isNewTodo && isStatusStep && isDraftNotPresent) {
      handleReset();
    }
  }, [newTodo, handleReset, draftIsPresent, step]);

  if (step === "title" || step === "description") {
    return (
      <div className="mb-8 space-y-4">
        <StepTitle
          value={newTodo.title}
          onChange={(value) => setNewTodo({ ...newTodo, title: value })}
          handleSubmit={handleStepSubmiting}
          isActive={step === "title"}
        />
        {step === "description" && (
          <StepDescription
            value={newTodo.description}
            onChange={(value) => setNewTodo({ ...newTodo, description: value })}
            isActive={step === "description"}
            handleSubmit={handleStepSubmiting}
          />
        )}
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div ref={setNodeRef}>
        <DraggableTodoCard {...newTodo} id={-1} />
        <div className="flex justify-center gap-2 pt-6">
          <Button variant="outline" onClick={handleStepBack}>
            Previous
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Discard
          </Button>
        </div>
      </div>
    </div>
  );
}
