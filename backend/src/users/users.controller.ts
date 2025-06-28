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
import {
  CreateUserSchema,
  UpdateUserSchema,
  CreateUserSwaggerDto,
  UpdateUserSwaggerDto,
} from './users.dto';
import { User } from '@prisma/client';
import { ZodError } from 'zod';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso.',
  })
  async getAll(): Promise<User[]> {
    return this.usersService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Usuário encontrado.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async getById(@Param('id') id: string): Promise<User> {
    return this.usersService.getById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar novo usuário' })
  @ApiBody({ type: CreateUserSwaggerDto })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso.' })
  @ApiResponse({ status: 409, description: 'E-mail já cadastrado.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
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
  @ApiOperation({ summary: 'Atualizar usuário' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateUserSwaggerDto })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  @ApiResponse({ status: 409, description: 'E-mail já cadastrado.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
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
  @ApiOperation({ summary: 'Deletar usuário' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Usuário deletado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async delete(@Param('id') id: string): Promise<User> {
    try {
      return await this.usersService.delete(id);
    } catch (e) {
      if (e instanceof NotFoundException) throw e;
      throw new BadRequestException('Erro ao deletar usuário');
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Login do usuário' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@email.com' },
        password: { type: 'string', example: '123456' },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({ status: 201, description: 'Login realizado com sucesso.' })
  @ApiResponse({ status: 400, description: 'E-mail ou senha inválidos.' })
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
