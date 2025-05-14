"use client";

import { LogOutIcon } from "lucide-react";
import { disconnectAction } from "./disconnect.action";
import { Button } from "@/components/ui/button";

export default function DisconnectButton() {
  return (
    <Button onClick={() => disconnectAction()}>
      <LogOutIcon />
      <span>Disconnect</span>
    </Button>
  );
}
