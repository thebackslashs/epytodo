import { getUser } from "@/lib/backend";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { User } from "@/types/user";

type GetSessionProps<T extends boolean = true> = {
  redirectTo: string;
  redirectIfNotFound?: T;
  redirectIfFound?: boolean;
};

type GetSessionReturn<T extends boolean = true> = T extends true
  ? User
  : User | null;

export async function getSession<T extends boolean = true>({
  redirectTo,
  redirectIfNotFound = true as T,
  redirectIfFound = false,
}: GetSessionProps<T>): Promise<GetSessionReturn<T>> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value ?? null;

  if (!session) {
    if (redirectIfNotFound) {
      redirect(redirectTo);
    }

    return null as GetSessionReturn<T>;
  }

  const user = await getUser(session);

  if (!user.success) {
    if (redirectIfNotFound) {
      redirect(redirectTo);
    }

    return null as GetSessionReturn<T>;
  }

  if (redirectIfFound) {
    redirect(redirectTo);
  }

  return user.user as GetSessionReturn<T>;
}
