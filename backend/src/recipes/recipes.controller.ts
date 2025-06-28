import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto, UpdateRecipeDto } from './recipes.dto';
import { Recipe, Favorite } from '@prisma/client';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  async getAll(): Promise<Recipe[]> {
    return this.recipesService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Recipe> {
    return this.recipesService.getById(id);
  }

  @Get('user/:userId')
  async getByUserId(@Param('userId') userId: string): Promise<Recipe[]> {
    return this.recipesService.getByUserId(userId);
  }

  @Post()
  async create(@Body() body: CreateRecipeDto): Promise<Recipe> {
    return this.recipesService.create(body);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateRecipeDto,
  ): Promise<Recipe> {
    return this.recipesService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Recipe> {
    return this.recipesService.delete(id);
  }

  @Post(':id/favorite')
  async addFavorite(
    @Param('id') recipeId: string,
    @Body('userId') userId: string,
  ): Promise<Favorite> {
    return this.recipesService.addFavorite(recipeId, userId);
  }

  @Delete(':id/favorite')
  async removeFavorite(
    @Param('id') recipeId: string,
    @Body('userId') userId: string,
  ): Promise<Favorite> {
    return this.recipesService.removeFavorite(recipeId, userId);
  }
}
