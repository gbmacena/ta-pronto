import { ApiProperty, PartialType } from '@nestjs/swagger';
import { z } from 'zod';

export class IngredientSwaggerDto {
  @ApiProperty({ example: 'Arroz' })
  name!: string;

  @ApiProperty({ example: '2 xícaras' })
  quantity!: string;
}

export class CreateRecipeSwaggerDto {
  @ApiProperty({ example: 'Arroz de forno' })
  title!: string;

  @ApiProperty({ example: 'Receita deliciosa de arroz de forno.' })
  description!: string;

  @ApiProperty({ example: 'Misture tudo e leve ao forno.' })
  instructions!: string;

  @ApiProperty({
    example: 'ALMOCO',
    enum: ['CAFE', 'ALMOCO', 'JANTA', 'SOBREMESA', 'BEBIDA', 'LANCHE'],
  })
  category!: string;

  @ApiProperty({ example: 'user-id-123' })
  createdById!: string;

  @ApiProperty({ type: [IngredientSwaggerDto] })
  ingredients!: IngredientSwaggerDto[];
}

export class UpdateRecipeSwaggerDto extends PartialType(
  CreateRecipeSwaggerDto,
) {}

export const CreateIngredientSchema = z.object({
  name: z.string(),
  quantity: z.string(),
});

export const CreateRecipeSchema = z.object({
  title: z.string(),
  description: z.string(),
  instructions: z.string(),
  category: z.enum([
    'CAFE',
    'ALMOCO',
    'JANTA',
    'SOBREMESA',
    'BEBIDA',
    'LANCHE',
  ]),
  createdById: z.string(),
  ingredients: z.array(CreateIngredientSchema),
});
export type CreateRecipeDto = z.infer<typeof CreateRecipeSchema>;

export const UpdateRecipeSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  instructions: z.string().optional(),
  category: z
    .enum(['CAFE', 'ALMOCO', 'JANTA', 'SOBREMESA', 'BEBIDA', 'LANCHE'])
    .optional(),
  ingredients: z.array(CreateIngredientSchema).optional(),
});
export type UpdateRecipeDto = z.infer<typeof UpdateRecipeSchema>;
