import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode } from '@nestjs/common';
import { CategorieService, Categoria } from './categorie.service';

export interface CreateCategoriaDto {
  nome: string;
}

@Controller('categorie')
export class CategorieController {
  constructor(private readonly categorieService: CategorieService) {}

  /** GET /categorie - Tutte le categorie */
  @Get()
  async getAllCategorie(): Promise<Categoria[]> {
    return this.categorieService.getAllCategorie();
  }

  /** GET /categorie/:id */
  @Get(':id')
  async getCategoriaById(@Param('id') id: string): Promise<Categoria> {
    return this.categorieService.getCategoriaById(parseInt(id, 10));
  }

  /** POST /categorie - Crea una nuova categoria */
  @Post()
  async createCategoria(@Body() dto: CreateCategoriaDto): Promise<Categoria> {
    return this.categorieService.createCategoria(dto.nome);
  }

  /** PUT /categorie/:id - Rinomina una categoria */
  @Put(':id')
  async updateCategoria(
    @Param('id') id: string,
    @Body() dto: CreateCategoriaDto,
  ): Promise<Categoria> {
    return this.categorieService.updateCategoria(parseInt(id, 10), dto.nome);
  }

  /** DELETE /categorie/:id */
  @Delete(':id')
  @HttpCode(204)
  async deleteCategoria(@Param('id') id: string): Promise<void> {
    return this.categorieService.deleteCategoria(parseInt(id, 10));
  }
}
