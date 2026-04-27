import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ComuniService, ComuneGeoJSON, OperatoriByCategoria } from './comuni.service';

export interface FindComuneDto {
  lat: number;
  lng: number;
}

@Controller('comuni')
export class ComuniController {
  constructor(private readonly comuniService: ComuniService) {}

  /**
   * GET /comuni - Return all comuni as GeoJSON
   */
  @Get()
  async getAllCmuni(): Promise<ComuneGeoJSON[]> {
    return this.comuniService.getAllCmuni();
  }

  /**
   * POST /comuni/find - Find comune by coordinates
   * Input: { lat: number, lng: number }
   */
  @Post('find')
  async findAtCoordinates(@Body() dto: FindComuneDto): Promise<ComuneGeoJSON | null> {
    return this.comuniService.findByCommuneAt(dto.lng, dto.lat);
  }

  /**
   * GET /comuni/:id/operatori - Get operators for a specific commune grouped by category
   */
  @Get(':id/operatori')
  async getOperatoriByComune(@Param('id') id: string): Promise<OperatoriByCategoria[]> {
    return this.comuniService.getOperatoriByComune(parseInt(id, 10));
  }
}
