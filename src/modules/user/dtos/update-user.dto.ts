import * as v from '@/lib/validator';

const UpdateUserDTO = v.object({
  fields: {
    name: v.string({ minLength: 1, maxLength: 255, optional: true }),
    email: v.string({
      minLength: 1,
      maxLength: 255,
      optional: true,
      isEmail: true,
    }),
    password: v.string({ minLength: 1, maxLength: 255, optional: true }),
    firstname: v.string({ minLength: 1, maxLength: 255, optional: true }),
  },
});

interface InferUpdateUserDTO {
  name?: string;
  email?: string;
  password?: string;
  firstname?: string;
}

export default UpdateUserDTO;
export type { InferUpdateUserDTO };
