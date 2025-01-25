import { z, ZodType } from 'zod';

export class UserValidation {
  static readonly register: ZodType = z.object({
    username: z
      .string()
      .min(4, { message: 'username must have 4 character minimal' }),
    password: z
      .string()
      .min(8, { message: "password must have 4 character minimal'" }),
    name: z.string().max(100),
  });
}
