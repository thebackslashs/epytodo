import * as v from '@/lib/validator';

const LoginDTO = v.object({
  fields: {
    email: v.string({ minLength: 1, maxLength: 255, isEmail: true }),
    password: v.string({ minLength: 1, maxLength: 255 }),
  },
});

interface InferLoginDTO {
  email: string;
  password: string;
}

export default LoginDTO;
export type { InferLoginDTO };
