import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecipeDto, UpdateRecipeDto } from './recipes.dto';
import { Recipe, Favorite } from '@prisma/client';

@Injectable()
export class RecipesService {
  constructor(private prisma: PrismaService) {}

  getAll(): Promise<Recipe[]> {
    return this.prisma.recipe.findMany();
  }

  async getById(id: string): Promise<Recipe> {
    const recipe: Recipe | null = await this.prisma.recipe.findUnique({
      where: { id },
    });
    if (!recipe) throw new NotFoundException('Receita não encontrada');
    return recipe;
  }

  create(data: CreateRecipeDto): Promise<Recipe> {
    return this.prisma.recipe.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        createdById: data.createdById,
        ingredients: {
          create: data.ingredients,
        },
      },
    });
  }

  update(id: string, data: UpdateRecipeDto): Promise<Recipe> {
    return this.prisma.recipe.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        ...(data.ingredients && {
          ingredients: {
            deleteMany: {},
            create: data.ingredients,
          },
        }),
      },
    });
  }

  delete(id: string): Promise<Recipe> {
    return this.prisma.recipe.delete({ where: { id } });
  }

  addFavorite(recipeId: string, userId: string): Promise<Favorite> {
    return this.prisma.favorite.create({
      data: {
        recipe: { connect: { id: recipeId } },
        user: { connect: { id: userId } },
      },
    });
  }

  removeFavorite(recipeId: string, userId: string): Promise<Favorite> {
    return this.prisma.favorite.delete({
      where: {
        userId_recipeId: { userId, recipeId },
      },
    });
  }
}
