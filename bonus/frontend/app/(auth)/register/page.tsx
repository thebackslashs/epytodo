import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RegisterPageClient from "./page.client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a new account",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Create an account
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Enter your information below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterPageClient />
        </CardContent>
      </Card>
    </div>
  );
}
