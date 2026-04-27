import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode } from '@nestjs/common';
import { OperatoriService, Operatore } from './operatori.service';

export interface CreateOperatoreDto {
  nome: string;
  cognome: string;
  categoriaId: number;
  comuneId: number;
}

export interface UpdateOperatoreDto {
  nome: string;
  cognome: string;
  categoriaId: number;
  comuneId: number;
}

@Controller('operatori')
export class OperatoriController {
  constructor(private readonly operatoriService: OperatoriService) {}

  /** GET /operatori - Lista tutti gli operatori */
  @Get()
  async getAllOperatori(): Promise<Operatore[]> {
    return this.operatoriService.getAllOperatori();
  }

  /** GET /operatori/:id */
  @Get(':id')
  async getOperatoreById(@Param('id') id: string): Promise<Operatore> {
    return this.operatoriService.getOperatoreById(parseInt(id, 10));
  }

  /** POST /operatori - Crea un nuovo operatore */
  @Post()
  async createOperatore(@Body() dto: CreateOperatoreDto): Promise<Operatore> {
    return this.operatoriService.createOperatore(dto.nome, dto.cognome, dto.categoriaId, dto.comuneId);
  }

  /** PUT /operatori/:id - Aggiorna nome, categoria e/o comune */
  @Put(':id')
  async updateOperatore(
    @Param('id') id: string,
    @Body() dto: UpdateOperatoreDto,
  ): Promise<Operatore> {
    return this.operatoriService.updateOperatore(
      parseInt(id, 10),
      dto.nome,
      dto.cognome,
      dto.categoriaId,
      dto.comuneId,
    );
  }

  /** DELETE /operatori/:id */
  @Delete(':id')
  @HttpCode(204)
  async deleteOperatore(@Param('id') id: string): Promise<void> {
    return this.operatoriService.deleteOperatore(parseInt(id, 10));
  }
}
