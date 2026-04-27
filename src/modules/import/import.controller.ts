import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ImportService } from './import.service';

export interface ImportRequest {
  filePath?: string;
}

export interface ImportResponse {
  success: boolean;
  message: string;
  data: {
    imported: number;
    skipped: number;
    errors: number;
  };
}

@Controller('import')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post('trapani')
  async importTrapani(@Body() req?: ImportRequest): Promise<ImportResponse> {
    try {
      const filePath = req?.filePath || 'comuni.geojson';
      const result = await this.importService.importTrapaniComuni(filePath);

      return {
        success: true,
        message: `Successfully imported ${result.imported} municipalities from Trapani province`,
        data: result,
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Import failed',
      );
    }
  }
}