import { z } from 'zod';

export const todoSchema = z.object({
  id: z.number(),
  title: z.string().min(1),
  description: z.string().min(1),
  status: z.enum(['not started', 'todo', 'in progress', 'done']),
  due_time: z.string().min(1),
  user_id: z.number(),
  created_at: z.string().min(1),
});

export type TodoSchema = z.infer<typeof todoSchema>;
