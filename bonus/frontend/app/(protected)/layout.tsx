import {
  Topbar,
  TopbarContent,
  TopbarLeft,
  TopbarRight,
} from "@/components/ui/topbar";
import { DisconnectButton } from "@/components/buttons/disconnect";
import { getSession } from "@/hooks/getSession";
import { Badge } from "@/components/ui/badge";
import { version } from "@/lib/version";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession({ redirectTo: "/login" });

  return (
    <>
      <Topbar>
        <TopbarContent>
          <TopbarLeft>
            <h1 className="text-lg font-semibold">Epytodo</h1>
            <Badge variant="outline">v{version}</Badge>
          </TopbarLeft>
          <TopbarRight>
            <div className="flex items-center gap-5">
              <span>Welcome, {user.name}</span>
              <DisconnectButton />
            </div>
          </TopbarRight>
        </TopbarContent>
      </Topbar>
      <div className="min-h-screen pt-14">{children}</div>
    </>
  );
}
