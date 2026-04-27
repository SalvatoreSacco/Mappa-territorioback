import { Controller, Post, BadRequestException, UseGuards } from '@nestjs/common';
import { ImportService } from './import.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

export interface ImportResponse {
  success: boolean;
  message: string;
  data: { imported: number; skipped: number; errors: number };
}

@Controller('import')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post('trapani')
  @UseGuards(JwtAuthGuard)
  async importTrapani(): Promise<ImportResponse> {
    try {
      const filePath = process.env.IMPORT_FILE_PATH || 'comuni.geojson';
      const result = await this.importService.importTrapaniComuni(filePath);
      return {
        success: true,
        message: `Importati ${result.imported} comuni`,
        data: result,
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Import fallito',
      );
    }
  }
}
