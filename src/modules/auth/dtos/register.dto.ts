import * as v from '@/lib/validator';

const RegisterDTO = v.object({
  fields: {
    email: v.string({ minLength: 1, maxLength: 255, isEmail: true }),
    name: v.string({ minLength: 1, maxLength: 255 }),
    password: v.string({ minLength: 1, maxLength: 255 }),
    firstname: v.string({ minLength: 1, maxLength: 255 }),
  },
});

interface InferRegisterDTO {
  email: string;
  name: string;
  password: string;
  firstname: string;
}

export default RegisterDTO;
export type { InferRegisterDTO };
