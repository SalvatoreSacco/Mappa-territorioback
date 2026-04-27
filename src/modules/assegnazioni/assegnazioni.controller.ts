import { Controller, Get, Post, Body } from '@nestjs/common';
import { AssegnazioniService, Assegnazione } from './assegnazioni.service';

export interface CreateAssegnazioneDto {
  comuneId: number;
  userId: number;
}

@Controller('assegnazioni')
export class AssegnazioniController {
  constructor(private readonly assegnazioniService: AssegnazioniService) {}

  /**
   * GET /assegnazioni - Get all assignments
   */
  @Get()
  async getAllAssegnazioni(): Promise<Assegnazione[]> {
    return this.assegnazioniService.getAllAssegnazioni();
  }

  /**
   * POST /assegnazioni - Create or update an assignment
   */
  @Post()
  async createAssegnazione(@Body() dto: CreateAssegnazioneDto): Promise<Assegnazione> {
    return this.assegnazioniService.createAssegnazione(dto.comuneId, dto.userId);
  }
}
