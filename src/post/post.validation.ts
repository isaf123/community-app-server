import { z, ZodType } from 'zod';

export class PostValidation {
  static readonly create: ZodType = z.object({
    title: z.string().min(1, { message: 'title cant empty' }),
    content: z.string().min(1, { message: 'cant empty' }),
    tags: z.array(z.string()),
  });

  static readonly comment: ZodType = z.object({
    content: z.string().min(1, { message: 'cant be blank' }),
  });
}
