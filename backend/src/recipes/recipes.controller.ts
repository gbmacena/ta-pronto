import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  BadRequestException,
  NotFoundException,
  ConflictException,
  Query,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeSchema, UpdateRecipeSchema } from './recipes.dto';
import { Recipe, Favorite } from '@prisma/client';
import { ZodError } from 'zod';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  async getAll(
    @Query('userId') userId?: string,
    @Query('onlyFavorites') onlyFavorites?: string,
  ): Promise<any[]> {
    if (onlyFavorites === 'true' && userId) {
      return this.recipesService.getFavoritesByUser(userId);
    }
    return this.recipesService.getAllWithFavorites(userId);
  }

  @Get(':id')
  async getById(
    @Param('id') id: string,
    @Query('userId') userId?: string,
  ): Promise<any> {
    return this.recipesService.getByIdWithFavorite(id, userId);
  }

  @Post()
  async create(@Body() body: unknown): Promise<Recipe> {
    try {
      const recipeData = CreateRecipeSchema.parse(body);
      return await this.recipesService.create(recipeData);
    } catch (e) {
      if (e instanceof ZodError) {
        throw new BadRequestException(
          e.errors.map((err) => err.message).join(', '),
        );
      }
      if (e instanceof NotFoundException) throw e;
      if (e instanceof BadRequestException) throw e;
      throw new BadRequestException('Erro ao criar receita');
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<Recipe> {
    try {
      const recipeData = UpdateRecipeSchema.parse(body);
      return await this.recipesService.update(id, recipeData);
    } catch (e) {
      if (e instanceof ZodError) {
        throw new BadRequestException(
          e.errors.map((err) => err.message).join(', '),
        );
      }
      if (e instanceof NotFoundException) throw e;
      if (e instanceof BadRequestException) throw e;
      throw new BadRequestException('Erro ao atualizar receita');
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Recipe> {
    try {
      return await this.recipesService.delete(id);
    } catch (e) {
      if (e instanceof NotFoundException) throw e;
      throw new BadRequestException('Erro ao deletar receita');
    }
  }

  @Post(':id/favorite')
  async addFavorite(
    @Param('id') recipeId: string,
    @Body('userId') userId: string,
  ): Promise<Favorite> {
    try {
      return await this.recipesService.addFavorite(recipeId, userId);
    } catch (e) {
      if (e instanceof NotFoundException) throw e;
      if (e instanceof ConflictException) throw e;
      throw new BadRequestException('Erro ao favoritar receita');
    }
  }

  @Delete(':id/favorite')
  async removeFavorite(
    @Param('id') id: string,
    @Body('userId') userId: string,
  ) {
    return this.recipesService.removeFavorite(id, userId);
  }

  @Get('by-user/:userId')
  async getByUser(@Param('userId') userId: string) {
    return this.recipesService.getByUser(userId);
  }
}
