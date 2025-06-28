import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw if user not found on update', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
    await expect(service.update('1', {} as any)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw if email already exists on update', async () => {
    jest
      .spyOn(prisma.user, 'findUnique')
      .mockResolvedValueOnce({
        id: '1',
        name: 'Test',
        email: 'test1@test.com',
        password: 'hashedpassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .mockResolvedValueOnce({
        id: '2',
        name: 'Other',
        email: 'test@test.com',
        password: 'hashedpassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    await expect(
      service.update('1', { email: 'test@test.com' } as any),
    ).rejects.toThrow(ConflictException);
  });

  it('should throw if password is too short on update', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id: '1',
      name: 'Test',
      email: 'test@test.com',
      password: 'hashedpassword',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await expect(
      service.update('1', { password: '123' } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('should update user', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id: '1',
      name: 'Test',
      email: 'test@test.com',
      password: 'hashedpassword',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    jest.spyOn(prisma.user, 'update').mockResolvedValue({
      id: '1',
      name: 'Test',
      email: 'test@test.com',
      password: 'hashedpassword',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const result = await service.update('1', { name: 'Test' } as any);
    expect(result).toHaveProperty('id', '1');
  });
});
