import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../common/database/database.service';
import { DbHelper } from '../../common/database/db.helper';

export interface ComuneGeoJSON {
  id: number;
  nome: string;
  geometry: any;
}

export interface Operatore {
  id: number;
  nome: string;
  cognome: string;
}

export interface OperatoriByCategoria {
  categoria: string;
  operatori: Operatore[];
}

@Injectable()
export class ComuniService {
  constructor(private readonly db: DatabaseService) {}

  async getAllCmuni(): Promise<ComuneGeoJSON[]> {
    const query = `
      SELECT 
        id,
        nome,
        ${DbHelper.asGeoJSON('geom')} as geometry
      FROM comuni
    `;

    const rows = await this.db.queryAll(query);
    return rows.map((row) => ({
      id: row.id,
      nome: row.nome,
      geometry: DbHelper.parseGeoJSON(row.geometry),
    }));
  }

  async findByCommuneAt(lng: number, lat: number): Promise<ComuneGeoJSON | null> {
    const query = `
      SELECT 
        id,
        nome,
        ${DbHelper.asGeoJSON('geom')} as geometry
      FROM comuni
      WHERE ${DbHelper.pointInsideGeometry('geom', lng, lat)}
      LIMIT 1
    `;

    const row = await this.db.queryOne(query);
    if (!row) return null;

    return {
      id: row.id,
      nome: row.nome,
      geometry: DbHelper.parseGeoJSON(row.geometry),
    };
  }

  async getOperatoriByComune(comuneId: number): Promise<OperatoriByCategoria[]> {
    const query = `
      SELECT 
        c.nome as categoria,
        json_agg(
          json_build_object('id', o.id, 'nome', o.nome, 'cognome', o.cognome)
        ) as operatori
      FROM operatori o
      JOIN categoria c ON o.categoria_id = c.id
      WHERE o.comune_id = $1
      GROUP BY c.id, c.nome
      ORDER BY c.nome
    `;

    const rows = await this.db.queryAll(query, [comuneId]);
    return rows.map((row) => ({
      categoria: row.categoria,
      operatori: row.operatori || [],
    }));
  }
}