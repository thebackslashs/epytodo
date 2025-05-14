import { User } from "@/types/user";

export type UserResponse =
  | {
      success: true;
      user: User;
    }
  | {
      success: false;
      code: "UNAUTHORIZED" | "INTERNAL_SERVER_ERROR";
    };

export const getUser = async (token: string): Promise<UserResponse> => {
  const response = await fetch(`${process.env.BACKEND_API_URL}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    return {
      success: false,
      code: "UNAUTHORIZED",
    };
  }

  if (response.status !== 200) {
    return {
      success: false,
      code: "INTERNAL_SERVER_ERROR",
    };
  }

  return {
    success: true,
    user: await response.json(),
  };
};
