import * as v from '@/lib/validator';

const GetTodoByIdSchema = v.object({
  fields: {
    id: v.string({ isNumber: true, numberCriteria: { min: 0 } }),
  },
});

export default GetTodoByIdSchema;
