import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { User, getUser } from 'epytodo-sdk';

interface GetSessionProps<T extends boolean = true> {
  redirectTo: string;
  redirectIfNotFound?: T;
  redirectIfFound?: boolean;
}

type GetSessionReturn<T extends boolean = true> = T extends true
  ? { user: User; token: string }
  : null;

export async function getSession<T extends boolean = true>({
  redirectTo,
  redirectIfNotFound = true as T,
  redirectIfFound = false,
}: GetSessionProps<T>): Promise<GetSessionReturn<T>> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value ?? null;

  if (!token) {
    if (redirectIfNotFound) {
      redirect(redirectTo);
    }

    return null as GetSessionReturn<T>;
  }

  const user = await getUser({
    auth: token,
  });

  if (!user.error && !user.data) {
    if (redirectIfNotFound) {
      redirect(redirectTo);
    }

    return null as GetSessionReturn<T>;
  }

  if (redirectIfFound) {
    redirect(redirectTo);
  }

  return { user: user.data as User, token } as GetSessionReturn<T>;
}
