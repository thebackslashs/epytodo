import * as v from '@/lib/validator';

const CreateTodoDTO = v.object({
  fields: {
    title: v.string({ minLength: 1, maxLength: 255 }),
    description: v.string({ minLength: 1 }),
    due_time: v.string({ isDate: true }),
    status: v.enum({
      values: ['not started', 'todo', 'in progress', 'done'],
    }),
    user_id: v.number({ min: 0 }),
  },
});

export interface InferCreateTodoDTO {
  title: string;
  description: string;
  due_time: string;
  status: 'not started' | 'todo' | 'in progress' | 'done';
  user_id: number;
}

export default CreateTodoDTO;
