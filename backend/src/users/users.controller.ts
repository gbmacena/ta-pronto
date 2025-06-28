import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserSchema, UpdateUserSchema } from './users.dto';
import { User } from '@prisma/client';
import { ZodError } from 'zod';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

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
    try {
      const userData = CreateUserSchema.parse(body);
      return await this.usersService.create(userData);
    } catch (e) {
      if (e instanceof ZodError) {
        throw new BadRequestException(
          e.errors.map((err) => err.message).join(', '),
        );
      }
      if (e instanceof ConflictException) throw e;
      if (e instanceof BadRequestException) throw e;
      throw new BadRequestException('Erro ao criar usuário');
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: unknown): Promise<User> {
    try {
      const userData = UpdateUserSchema.parse(body);
      return await this.usersService.update(id, userData);
    } catch (e) {
      if (e instanceof ZodError) {
        throw new BadRequestException(
          e.errors.map((err) => err.message).join(', '),
        );
      }
      if (e instanceof ConflictException) throw e;
      if (e instanceof NotFoundException) throw e;
      if (e instanceof BadRequestException) throw e;
      throw new BadRequestException('Erro ao atualizar usuário');
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<User> {
    try {
      return await this.usersService.delete(id);
    } catch (e) {
      if (e instanceof NotFoundException) throw e;
      throw new BadRequestException('Erro ao deletar usuário');
    }
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    if (!email || !password) {
      throw new BadRequestException('E-mail e senha são obrigatórios');
    }
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('E-mail ou senha inválidos');
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new BadRequestException('E-mail ou senha inválidos');
    }
    const payload = { sub: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload);
    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}
