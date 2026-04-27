import { Injectable, Logger } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { DatabaseService } from '../../common/database/database.service';

export interface GeoJSONFeature {
  type: string;
  properties: {
    name: string;
    prov_name: string;
    [key: string]: any;
  };
  geometry: {
    type: string;
    coordinates: any[];
  };
}

export interface GeoJSONData {
  type: string;
  features: GeoJSONFeature[];
}

@Injectable()
export class ImportService {
  private readonly logger = new Logger(ImportService.name);
  private readonly TRAPANI_PROVINCE = 'Trapani';

  constructor(private readonly db: DatabaseService) {}

  async importTrapaniComuni(filePath: string = 'comuni.geojson'): Promise<{
    imported: number;
    skipped: number;
    errors: number;
  }> {
    this.logger.log(`Starting import from ${filePath}`);
    
    try {
      // Read GeoJSON file
      const fileContent = await readFile(filePath, 'utf-8');
      const geojsonData: GeoJSONData = JSON.parse(fileContent);

      if (!geojsonData.features || !Array.isArray(geojsonData.features)) {
        throw new Error('Invalid GeoJSON format: missing features array');
      }

      this.logger.log(`Total features in file: ${geojsonData.features.length}`);

      // Filter features for Trapani province
      const trapaniFeatures = geojsonData.features.filter(
        (feature) => feature.properties?.prov_name === this.TRAPANI_PROVINCE,
      );

      this.logger.log(`Found ${trapaniFeatures.length} features for Trapani province`);

      // Import features
      let imported = 0;
      let skipped = 0;
      let errors = 0;

      for (const feature of trapaniFeatures) {
        try {
          const result = await this.insertComune(feature);
          if (result) {
            imported++;
          } else {
            skipped++;
          }
        } catch (error) {
          errors++;
          this.logger.error(
            `Error importing feature ${feature.properties?.name}: ${error instanceof Error ? error.message : String(error)}`,
          );
        }
      }

      this.logger.log(
        `Import completed: ${imported} imported, ${skipped} skipped, ${errors} errors`,
      );

      return { imported, skipped, errors };
    } catch (error) {
      this.logger.error(
        `Import failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  private async insertComune(feature: GeoJSONFeature): Promise<boolean> {
    const { nome, geojson } = this.extractFeatureData(feature);

    if (!nome || !geojson) {
      this.logger.warn(`Skipping feature with missing data`);
      return false;
    }

    // Check if comune already exists
    const existing = await this.db.queryOne(
      'SELECT id FROM comuni WHERE nome = $1',
      [nome],
    );

    if (existing) {
      this.logger.debug(`Comune ${nome} already exists, skipping`);
      return false;
    }

    // Insert into database using ST_GeomFromGeoJSON
    const query = `
      INSERT INTO comuni (nome, geom)
      VALUES ($1, ST_GeomFromGeoJSON($2))
      RETURNING id
    `;

    const result = await this.db.queryOne(query, [nome, geojson]);
    this.logger.debug(`Imported comune: ${nome} (id: ${result.id})`);
    return true;
  }

  private extractFeatureData(feature: GeoJSONFeature): {
    nome: string | null;
    geojson: string | null;
  } {
    try {
      const nome = feature.properties?.name?.trim() || null;
      const geometry = feature.geometry;

      if (!geometry) {
        return { nome, geojson: null };
      }

      // Convert geometry to GeoJSON string for ST_GeomFromGeoJSON
      const geojson = JSON.stringify(geometry);
      return { nome, geojson };
    } catch (error) {
      this.logger.error(`Error extracting feature data: ${error}`);
      return { nome: null, geojson: null };
    }
  }
}