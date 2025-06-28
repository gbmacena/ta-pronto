import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async getById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async create(data: CreateUserDto): Promise<User> {
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) throw new ConflictException('E-mail já cadastrado');
    if (!data.password || data.password.length < 6)
      throw new BadRequestException('Senha muito curta');
    if (!data.name) throw new BadRequestException('Nome é obrigatório');
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
      },
    });
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    if (data.email) {
      const existing = await this.prisma.user.findUnique({
        where: { email: data.email },
      });
      if (existing && existing.id !== id)
        throw new ConflictException('E-mail já cadastrado');
    }
    if (data.password && data.password.length < 6)
      throw new BadRequestException('Senha muito curta');
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return await this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return await this.prisma.user.delete({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
