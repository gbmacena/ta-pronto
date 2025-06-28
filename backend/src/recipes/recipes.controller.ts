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
import {
  CreateRecipeSchema,
  UpdateRecipeSchema,
  CreateRecipeSwaggerDto,
  UpdateRecipeSwaggerDto,
} from './recipes.dto';
import { Recipe, Favorite } from '@prisma/client';
import { ZodError } from 'zod';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('recipes')
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar receitas (todas ou favoritas de um usuário)',
  })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiQuery({
    name: 'onlyFavorites',
    required: false,
    type: String,
    example: 'true',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de receitas retornada com sucesso.',
  })
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
  @ApiOperation({ summary: 'Buscar receita por ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Receita encontrada.' })
  @ApiResponse({ status: 404, description: 'Receita não encontrada.' })
  async getById(
    @Param('id') id: string,
    @Query('userId') userId?: string,
  ): Promise<any> {
    return this.recipesService.getByIdWithFavorite(id, userId);
  }

  @Post()
  @ApiOperation({ summary: 'Criar nova receita' })
  @ApiBody({ type: CreateRecipeSwaggerDto })
  @ApiResponse({ status: 201, description: 'Receita criada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
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
  @ApiOperation({ summary: 'Atualizar receita' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateRecipeSwaggerDto })
  @ApiResponse({ status: 200, description: 'Receita atualizada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Receita não encontrada.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
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
  @ApiOperation({ summary: 'Deletar receita' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Receita deletada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Receita não encontrada.' })
  async delete(@Param('id') id: string): Promise<Recipe> {
    try {
      return await this.recipesService.delete(id);
    } catch (e) {
      if (e instanceof NotFoundException) throw e;
      throw new BadRequestException('Erro ao deletar receita');
    }
  }

  @Post(':id/favorite')
  @ApiOperation({ summary: 'Adicionar receita aos favoritos' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', example: 'user-id-123' },
      },
      required: ['userId'],
    },
  })
  @ApiResponse({ status: 201, description: 'Receita favoritada com sucesso.' })
  @ApiResponse({
    status: 404,
    description: 'Receita ou usuário não encontrado.',
  })
  @ApiResponse({ status: 409, description: 'Já está nos favoritos.' })
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
  @ApiOperation({ summary: 'Remover receita dos favoritos' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', example: 'user-id-123' },
      },
      required: ['userId'],
    },
  })
  @ApiResponse({ status: 200, description: 'Receita removida dos favoritos.' })
  async removeFavorite(
    @Param('id') id: string,
    @Body('userId') userId: string,
  ) {
    return this.recipesService.removeFavorite(id, userId);
  }

  @Get('by-user/:userId')
  @ApiOperation({ summary: 'Listar receitas criadas por um usuário' })
  @ApiParam({ name: 'userId', type: String })
  @ApiResponse({ status: 200, description: 'Lista de receitas do usuário.' })
  async getByUser(@Param('userId') userId: string) {
    return this.recipesService.getByUser(userId);
  }
}
