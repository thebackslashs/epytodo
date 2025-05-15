'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import RegisterSchema from './schema';
import EmailField from '@/src/components/fields/auth/email.field';
import PasswordField from '@/src/components/fields/auth/password.field';
import { Button } from '@/src/components/ui/button';
import Link from 'next/link';
import { registerAction } from './actions';
import { toast } from 'sonner';
import { Input } from '@/src/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form';

export default function RegisterPageClient() {
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      firstname: '',
      name: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    const result = await registerAction(data);

    if (result?.validationErrors || result?.serverError) {
      toast.error(result.serverError);
      form.setError('email', {});
      form.setError('password', {});
      form.setError('firstname', {});
      form.setError('name', {});
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
        <FormField
          control={form.control}
          name="firstname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-full"
          type="submit"
          size="lg"
          disabled={!form.formState.isValid}
          isLoading={form.formState.isSubmitting}
        >
          Sign up
        </Button>
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary">
            Sign in
          </Link>
        </p>
      </form>
    </Form>
  );
}
