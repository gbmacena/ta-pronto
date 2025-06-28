import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getAll: jest.fn().mockResolvedValue([]),
            getById: jest.fn().mockResolvedValue({
              id: '1',
              name: 'Test',
              email: 'test@test.com',
            }),
            create: jest.fn().mockResolvedValue({
              id: '1',
              name: 'Test',
              email: 'test@test.com',
            }),
          },
        },
        {
          provide: JwtService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an array from getAll', async () => {
    const result = await controller.getAll();
    expect(Array.isArray(result)).toBe(true);
  });

  it('should return a user from getById', async () => {
    const result = await controller.getById('1');
    expect(result).toHaveProperty('id', '1');
    expect(result).toHaveProperty('name', 'Test');
  });

  it('should create a user', async () => {
    const result = await controller.create({
      name: 'Test',
      email: 'test@test.com',
      password: '123456',
    });
    expect(result).toHaveProperty('email', 'test@test.com');
  });
});
