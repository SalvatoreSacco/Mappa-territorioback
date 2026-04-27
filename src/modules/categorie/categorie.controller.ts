import {
  Controller, Get, Post, Put, Delete,
  Body, Param, HttpCode, UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { IsString, MinLength } from 'class-validator';
import { CategorieService, Categoria } from './categorie.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

export class CreateCategoriaDto {
  @IsString() @MinLength(1) nome: string;
}

@Controller('categorie')
export class CategorieController {
  constructor(private readonly categorieService: CategorieService) {}

  @Get()
  async getAllCategorie(): Promise<Categoria[]> {
    return this.categorieService.getAllCategorie();
  }

  @Get(':id')
  async getCategoriaById(@Param('id', ParseIntPipe) id: number): Promise<Categoria> {
    return this.categorieService.getCategoriaById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createCategoria(@Body() dto: CreateCategoriaDto): Promise<Categoria> {
    return this.categorieService.createCategoria(dto.nome);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateCategoria(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateCategoriaDto,
  ): Promise<Categoria> {
    return this.categorieService.updateCategoria(id, dto.nome);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async deleteCategoria(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.categorieService.deleteCategoria(id);
  }
}
