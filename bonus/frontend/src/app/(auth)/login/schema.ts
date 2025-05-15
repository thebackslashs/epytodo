import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export default LoginSchema;
