import { Controller, Get, Post, Delete, Body, Param, HttpCode, UseGuards, ParseIntPipe } from '@nestjs/common';
import { IsInt, Min } from 'class-validator';
import { AssegnazioniService, Assegnazione } from './assegnazioni.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

export class CreateAssegnazioneDto {
  @IsInt() @Min(1) comuneId: number;
  @IsInt() @Min(1) userId: number;
}

@Controller('assegnazioni')
export class AssegnazioniController {
  constructor(private readonly assegnazioniService: AssegnazioniService) {}

  @Get()
  async getAllAssegnazioni(): Promise<Assegnazione[]> {
    return this.assegnazioniService.getAllAssegnazioni();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createAssegnazione(@Body() dto: CreateAssegnazioneDto): Promise<Assegnazione> {
    return this.assegnazioniService.createAssegnazione(dto.comuneId, dto.userId);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async deleteAssegnazione(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.assegnazioniService.deleteAssegnazione(id);
  }
}
