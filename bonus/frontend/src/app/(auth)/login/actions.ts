'use server';

import '@/src/lib/epytodo-sdk.config';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { SafeActionError, actionClient } from '@/src/lib/safe-action';
import { cookies } from 'next/headers';
import LoginSchema from './schema';
import { postLogin } from 'epytodo-sdk';

export const loginAction = actionClient
  .schema(LoginSchema)
  .action(async ({ parsedInput: credentials }) => {
    const result = await postLogin({
      body: credentials,
    });

    if (result.error?.msg) {
      if (result.error.msg === 'Invalid Credentials') {
        throw new SafeActionError('Invalid email or password.');
      }

      throw new SafeActionError('Internal server error.');
    }

    if (!result.data?.token) {
      throw new SafeActionError('Internal server error.');
    }

    const cookieStore = await cookies();
    cookieStore.set('session', result.data.token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 24 * 60 * 60,
    });

    revalidatePath('/', 'layout');
    redirect('/');
  });
