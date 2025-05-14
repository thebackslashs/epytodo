import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Control, FieldValues, Path } from "react-hook-form";

type PasswordFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  description?: string;
};

export default function PasswordField<T extends FieldValues>({
  control,
  name,
  label,
  description,
}: PasswordFieldProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label !== "" && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <div className="relative">
              <Input
                id={name}
                type={showPassword ? "text" : "password"}
                placeholder="********"
                {...field}
                className="text-sm"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground hover:bg-accent/10 cursor-pointer"
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </Button>
            </div>
          </FormControl>
          {description !== "" && (
            <FormDescription>
              {description ?? "Password must be at least 8 characters long"}
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
