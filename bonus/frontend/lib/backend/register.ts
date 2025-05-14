export type RegisterResponse =
  | {
      success: true;
      token: string;
    }
  | {
      success: false;
      code: "INTERNAL_SERVER_ERROR" | "EMAIL_ALREADY_EXISTS";
    };

export const register = async (credentials: {
  email: string;
  password: string;
  firstname: string;
  name: string;
}) => {
  const response = await fetch(`${process.env.BACKEND_API_URL}/register`, {
    method: "POST",
    body: JSON.stringify(credentials),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status === 400) {
    return {
      success: false,
      code: "EMAIL_ALREADY_EXISTS",
    };
  }

  if (response.status !== 201) {
    return {
      success: false,
      code: "INTERNAL_SERVER_ERROR",
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
