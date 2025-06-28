import { ApiProperty, PartialType } from '@nestjs/swagger';
import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string(),
});
export type CreateUserDto = z.infer<typeof CreateUserSchema>;

export class CreateUserSwaggerDto {
  @ApiProperty({ example: 'user@email.com' })
  email!: string;

  @ApiProperty({ example: '123456' })
  password!: string;

  @ApiProperty({ example: 'João' })
  name!: string;
}

export const UpdateUserSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  name: z.string().optional(),
});
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;

export class UpdateUserSwaggerDto extends PartialType(CreateUserSwaggerDto) {}
