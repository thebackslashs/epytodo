import * as v from '@/lib/validator';

export const UserIdDTO = v.object({
  fields: {
    id: v.string({ isNumber: true, numberCriteria: { min: 0 } }),
  },
});
