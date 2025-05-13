import * as v from '@/lib/validator';

const UpdateTodoDTO = v.object({
    fields: {
        title: v.string({ minLength: 1, maxLength: 255, optional: true }),
        description: v.string({ minLength: 1, optional: true }),
        due_time: v.string({ minLength: 1, optional: true }), // Will validate as ISO date string
        status: v.string({ pattern: /^(not started|todo|in progress|done)$/, optional: true })
    }
});

export interface InferUpdateTodoDTO {
    title?: string;
    description?: string;
    due_time?: string;
    status?: 'not started' | 'todo' | 'in progress' | 'done';
}

export default UpdateTodoDTO;