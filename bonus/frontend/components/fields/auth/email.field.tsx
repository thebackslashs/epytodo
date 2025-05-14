import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control, FieldValues, Path } from "react-hook-form";

type EmailFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  description?: string;
};

export default function EmailField<T extends FieldValues>({
  control,
  name,
  label,
  description,
}: EmailFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label !== "" && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input
              id={name}
              type="email"
              placeholder="example@email.com"
              {...field}
              className="text-sm"
            />
          </FormControl>
          {description !== "" && (
            <FormDescription>
              {description ?? "Email must be a valid email address."}
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
