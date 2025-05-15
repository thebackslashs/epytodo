'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { SafeActionError, actionClient } from '@/src/lib/safe-action';
import { cookies } from 'next/headers';
import { postRegister } from 'epytodo-sdk';

import RegisterSchema from './schema';

export const registerAction = actionClient
  .schema(RegisterSchema)
  .action(async ({ parsedInput: credentials }) => {
    const result = await postRegister({
      body: credentials,
    });

    if (result.error) {
      if (result.error.msg === 'Email already exists') {
        throw new SafeActionError('Email already exists.');
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
    });

    revalidatePath('/', 'layout');
    redirect('/');
  });
