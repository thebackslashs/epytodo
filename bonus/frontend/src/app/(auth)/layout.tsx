import { getSession } from '@/src/hooks/getSession';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await getSession({
    redirectTo: '/',
    redirectIfFound: true,
    redirectIfNotFound: false,
  });

  return <>{children}</>;
}
