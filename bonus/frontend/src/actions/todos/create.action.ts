'use server';

import '@/src/lib/epytodo-sdk.config';

import { actionClient } from '@/src/lib/safe-action';
import { todoSchema } from './todo.schema';
import { getSession } from '@/src/hooks/getSession';
import { postTodos } from 'epytodo-sdk';

const createTodoAction = actionClient
  .schema(todoSchema.omit({ id: true, created_at: true, user_id: true }))
  .action(async ({ parsedInput }) => {
    const { token, user } = await getSession({ redirectTo: '/login' });

    const res = await postTodos({
      auth: token,
      body: {
        ...parsedInput,
        user_id: user.id,
      },
    });

    if (res.error || !res.data) {
      throw new Error((res.error as Error).message);
    }

    return res.data;
  });

export default createTodoAction;
