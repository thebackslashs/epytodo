import * as v from '@/lib/validator';

const GetTodoByIdSchema = v.object({
  fields: {
    id: v.number({ min: 0 }),
  },
});

export default GetTodoByIdSchema;
