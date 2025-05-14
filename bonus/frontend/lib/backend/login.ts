export type LoginResponse =
  | {
      success: true;
      token: string;
    }
  | {
      success: false;
      code: "INTERNAL_SERVER_ERROR" | "INVALID_CREDENTIALS";
    };

export const login = async (credentials: {
  email: string;
  password: string;
}) => {
  const response = await fetch(`${process.env.BACKEND_API_URL}/login`, {
    method: "POST",
    body: JSON.stringify(credentials),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status === 400) {
    return {
      success: false,
      code: "INTERNAL_SERVER_ERROR",
    };
  }

  if (response.status === 401) {
    return {
      success: false,
      code: "INVALID_CREDENTIALS",
    };
  }

  const data = await response.json();

  if (!data.token) {
    return {
      success: false,
      code: "INTERNAL_SERVER_ERROR",
    };
  }

  return {
    success: true,
    token: data.token,
  };
};
