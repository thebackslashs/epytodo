import { createSafeActionClient } from "next-safe-action";

export const actionClient = createSafeActionClient({
  handleServerError: (error) => {
    if (error instanceof SafeActionError) {
      return error.message;
    }

    return "Something went wrong, please try again later.";
  },
});
export class SafeActionError extends Error {
  constructor(message: string) {
    super(message);
  }
}
