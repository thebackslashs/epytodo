'use server';

import { actionClient } from '@/src/lib/safe-action';
import { todoSchema } from './todo.schema';
import { getSession } from '@/src/hooks/getSession';
import { putTodosById } from 'epytodo-sdk';

const updateTodoAction = actionClient
  .schema(
    todoSchema
      .omit({ user_id: true, created_at: true })
      .partial()
      .required({ id: true })
  )
  .action(async ({ parsedInput }) => {
    const { token } = await getSession({ redirectTo: '/login' });

    const { id: _, ...body } = parsedInput;

    const res = await putTodosById({
      auth: token,
      path: {
        id: parsedInput.id,
      },
      body,
    });

    if (res.error || !res.data) {
      console.error(res.error ?? 'Cannot update todo, unknown error');
      return {
        serverError: 'Cannot update todo, please try again later.',
      };
    }

    return res.data;
  });

export default updateTodoAction;
