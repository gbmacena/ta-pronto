import { Test, TestingModule } from '@nestjs/testing';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';

describe('RecipesController', () => {
  let controller: RecipesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipesController],
      providers: [
        {
          provide: RecipesService,
          useValue: {
            getAll: jest.fn().mockResolvedValue([]),
            getAllWithFavorites: jest.fn().mockResolvedValue([]),
            getFavoritesByUser: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    controller = module.get<RecipesController>(RecipesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an array from getAll', async () => {
    const result = await controller.getAll();
    expect(Array.isArray(result)).toBe(true);
  });
});
