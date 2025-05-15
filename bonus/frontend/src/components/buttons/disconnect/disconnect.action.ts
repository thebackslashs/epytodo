'use server';

import { actionClient } from '@/src/lib/safe-action';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const disconnectAction = actionClient.action(async () => {
  const cookieStore = await cookies();
  cookieStore.delete('session');

  redirect('/login');
});
