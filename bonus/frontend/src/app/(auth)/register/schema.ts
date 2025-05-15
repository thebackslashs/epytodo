import { z } from "zod";

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  firstname: z.string().min(2).max(50),
  name: z.string().min(2).max(50),
});

export default RegisterSchema;
