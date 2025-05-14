"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { actionClient, SafeActionError } from "@/lib/safe-action";
import { cookies } from "next/headers";
import { login } from "@/lib/backend";
import LoginSchema from "./schema";

export const loginAction = actionClient
  .schema(LoginSchema)
  .action(async ({ parsedInput: credentials }) => {
    const result = await login(credentials);

    if (result.success === false) {
      if (result.code === "INVALID_CREDENTIALS") {
        throw new SafeActionError("Invalid email or password.");
      }

      throw new SafeActionError("Internal server error.");
    }

    const cookieStore = await cookies();
    cookieStore.set("session", result.token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

    revalidatePath("/", "layout");
    redirect("/");
  });
