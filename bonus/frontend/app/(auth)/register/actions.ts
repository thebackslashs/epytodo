"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { actionClient, SafeActionError } from "@/lib/safe-action";
import { cookies } from "next/headers";
import { register } from "@/lib/backend";
import RegisterSchema from "./schema";

export const registerAction = actionClient
  .schema(RegisterSchema)
  .action(async ({ parsedInput: credentials }) => {
    const result = await register(credentials);

    if (result.success === false) {
      if (result.code === "EMAIL_ALREADY_EXISTS") {
        throw new SafeActionError("Email already exists.");
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
