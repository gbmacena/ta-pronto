import { z } from 'zod';

export const CreateIngredientSchema = z.object({
  name: z.string(),
  quantity: z.string(),
});

export const CreateRecipeSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.enum(['CAFE', 'ALMOCO', 'JANTA', 'SOBREMESA', 'BEBIDA']),
  createdById: z.string(),
  ingredients: z.array(CreateIngredientSchema),
});
export type CreateRecipeDto = z.infer<typeof CreateRecipeSchema>;

export const UpdateRecipeSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  category: z
    .enum(['CAFE', 'ALMOCO', 'JANTA', 'SOBREMESA', 'BEBIDA'])
    .optional(),
  ingredients: z.array(CreateIngredientSchema).optional(),
});
export type UpdateRecipeDto = z.infer<typeof UpdateRecipeSchema>;
