import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecipeDto, UpdateRecipeDto } from './recipes.dto';
import { Recipe, Favorite } from '@prisma/client';

@Injectable()
export class RecipesService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<Recipe[]> {
    return this.prisma.recipe.findMany();
  }

  async getAllWithFavorites(userId?: string) {
    const recipes = await this.prisma.recipe.findMany({
      include: {
        favorites: userId
          ? {
              where: { userId },
              select: { id: true },
            }
          : false,
        ingredients: true,
      },
    });

    return recipes.map((recipe) => ({
      ...recipe,
      userLiked: userId ? recipe.favorites.length > 0 : false,
      favorites: undefined,
    }));
  }

  async getById(id: string): Promise<Recipe> {
    const recipe = await this.prisma.recipe.findUnique({ where: { id } });
    if (!recipe) throw new NotFoundException('Receita não encontrada');
    return recipe;
  }

  async getByIdWithFavorite(id: string, userId?: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
      include: {
        ingredients: true,
        favorites: userId
          ? {
              where: { userId },
              select: { id: true },
            }
          : false,
      },
    });
    if (!recipe) throw new NotFoundException('Receita não encontrada');
    return {
      ...recipe,
      userLiked: userId ? recipe.favorites.length > 0 : false,
      favorites: undefined,
    };
  }

  async create(data: CreateRecipeDto): Promise<Recipe> {
    if (!data.ingredients || data.ingredients.length === 0) {
      throw new BadRequestException(
        'A receita deve ter pelo menos um ingrediente',
      );
    }
    const user = await this.prisma.user.findUnique({
      where: { id: data.createdById },
    });
    if (!user) throw new NotFoundException('Usuário criador não encontrado');
    return this.prisma.recipe.create({
      data: {
        title: data.title,
        description: data.description,
        instructions: data.instructions,
        category: data.category,
        createdById: data.createdById,
        ingredients: {
          create: data.ingredients,
        },
      },
    });
  }

  async update(id: string, data: UpdateRecipeDto): Promise<Recipe> {
    const recipe = await this.prisma.recipe.findUnique({ where: { id } });
    if (!recipe) throw new NotFoundException('Receita não encontrada');
    if (data.ingredients && data.ingredients.length === 0) {
      throw new BadRequestException(
        'A receita deve ter pelo menos um ingrediente',
      );
    }
    return this.prisma.recipe.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        instructions: data.instructions,
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

  async delete(id: string): Promise<Recipe> {
    const recipe = await this.prisma.recipe.findUnique({ where: { id } });
    if (!recipe) throw new NotFoundException('Receita não encontrada');
    return this.prisma.recipe.delete({ where: { id } });
  }

  async addFavorite(recipeId: string, userId: string): Promise<Favorite> {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id: recipeId },
    });
    if (!recipe) throw new NotFoundException('Receita não encontrada');
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    const existing = await this.prisma.favorite.findUnique({
      where: { userId_recipeId: { userId, recipeId } },
    });
    if (existing) throw new ConflictException('Já está nos favoritos');
    return this.prisma.favorite.create({
      data: {
        recipe: { connect: { id: recipeId } },
        user: { connect: { id: userId } },
      },
    });
  }

  async removeFavorite(recipeId: string, userId: string) {
    const favorite = await this.prisma.favorite.findFirst({
      where: { recipeId, userId },
    });
    if (!favorite) {
      return;
    }
    await this.prisma.favorite.delete({ where: { id: favorite.id } });
  }

  async getFavoritesByUser(userId: string) {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      include: { recipe: { include: { ingredients: true } } },
    });
    return favorites.map((fav) => ({
      ...fav.recipe,
      userLiked: true,
    }));
  }

  async getByUser(userId: string) {
    return this.prisma.recipe.findMany({
      where: { createdById: userId },
      include: { ingredients: true, favorites: true },
    });
  }
}
