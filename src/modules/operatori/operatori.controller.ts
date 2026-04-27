import {
  Controller, Get, Post, Put, Delete,
  Body, Param, HttpCode, UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { IsString, IsInt, MinLength, Min } from 'class-validator';
import { OperatoriService, Operatore } from './operatori.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

export class CreateOperatoreDto {
  @IsString() @MinLength(1) nome: string;
  @IsString() @MinLength(1) cognome: string;
  @IsInt() @Min(1) categoriaId: number;
  @IsInt() @Min(1) comuneId: number;
}

@Controller('operatori')
export class OperatoriController {
  constructor(private readonly operatoriService: OperatoriService) {}

  @Get()
  async getAllOperatori(): Promise<Operatore[]> {
    return this.operatoriService.getAllOperatori();
  }

  @Get(':id')
  async getOperatoreById(@Param('id', ParseIntPipe) id: number): Promise<Operatore> {
    return this.operatoriService.getOperatoreById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createOperatore(@Body() dto: CreateOperatoreDto): Promise<Operatore> {
    return this.operatoriService.createOperatore(dto.nome, dto.cognome, dto.categoriaId, dto.comuneId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateOperatore(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateOperatoreDto,
  ): Promise<Operatore> {
    return this.operatoriService.updateOperatore(id, dto.nome, dto.cognome, dto.categoriaId, dto.comuneId);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async deleteOperatore(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.operatoriService.deleteOperatore(id);
  }
}
