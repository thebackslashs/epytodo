import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TodoCardProps {
  title: string;
  description?: string;
  completed: boolean;
  className?: string;
}

const TodoTitle = ({
  title,
  completed,
}: Pick<TodoCardProps, "title" | "completed">) => (
  <CardTitle className={cn("text-lg font-medium", completed && "line-through")}>
    {title}
  </CardTitle>
);

export function TodoCard({
  title,
  description,
  completed,
  className,
}: TodoCardProps) {
  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <TodoTitle title={title} completed={completed} />
        </div>
      </CardHeader>
      {description && (
        <CardContent>
          <CardDescription>{description}</CardDescription>
        </CardContent>
      )}
    </Card>
  );
}
