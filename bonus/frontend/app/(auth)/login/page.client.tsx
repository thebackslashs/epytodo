"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import LoginSchema from "./schema";
import { Form } from "@/components/ui/form";
import EmailField from "@/components/fields/auth/email.field";
import PasswordField from "@/components/fields/auth/password.field";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { loginAction } from "./actions";
import { toast } from "sonner";

export default function LoginPageClient() {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    const result = await loginAction(data);

    if (result?.validationErrors || result?.serverError) {
      toast.error(result.serverError);
      form.setError("email", {});
      form.setError("password", {});
      return;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <EmailField
          control={form.control}
          name="email"
          label="Email"
          description="Enter your email address."
        />
        <PasswordField
          control={form.control}
          name="password"
          label="Password"
          description="Enter your password."
        />
        <Button
          className="w-full"
          type="submit"
          size="lg"
          disabled={!form.formState.isValid}
          isLoading={form.formState.isSubmitting}
        >
          Sign in
        </Button>
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary">
            Sign up
          </Link>
        </p>
      </form>
    </Form>
  );
}
