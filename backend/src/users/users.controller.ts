import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserSchema, UpdateUserSchema } from './users.dto';
import { User } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAll(): Promise<User[]> {
    return this.usersService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<User> {
    return this.usersService.getById(id);
  }

  @Post()
  async create(@Body() body: unknown): Promise<User> {
    const userData = CreateUserSchema.parse(body);
    return this.usersService.create(userData);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: unknown): Promise<User> {
    const userData = UpdateUserSchema.parse(body);
    return this.usersService.update(id, userData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<User> {
    return this.usersService.delete(id);
  }
}
