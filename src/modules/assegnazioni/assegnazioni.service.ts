import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../common/database/database.service';
import { User } from '../users/users.service';
import { ComuneGeoJSON } from '../comuni/comuni.service';
import { DbHelper } from '../../common/database/db.helper';

export interface Assegnazione {
  id: number;
  comune: ComuneGeoJSON;
  user: User;
}

@Injectable()
export class AssegnazioniService {
  constructor(private readonly db: DatabaseService) {}

  async getAllAssegnazioni(): Promise<Assegnazione[]> {
    const query = `
      SELECT 
        a.id,
        a.comune_id,
        a.user_id,
        c.nome,
        ${DbHelper.asGeoJSON('c.geom')} as geometry,
        u.name
      FROM assegnazioni a
      JOIN comuni c ON a.comune_id = c.id
      JOIN users u ON a.user_id = u.id
      ORDER BY a.id
    `;

    const rows = await this.db.queryAll(query);
    return rows.map((row) => ({
      id: row.id,
      comune: {
        id: row.comune_id,
        nome: row.nome,
        geometry: DbHelper.parseGeoJSON(row.geometry),
      },
      user: {
        id: row.user_id,
        name: row.name,
      },
    }));
  }

  async createAssegnazione(comuneId: number, userId: number): Promise<Assegnazione> {
    let query = `
      SELECT id FROM assegnazioni 
      WHERE comune_id = $1 AND user_id = $2
    `;
    const existing = await this.db.queryOne(query, [comuneId, userId]);

    if (existing) {
      return this.getAssegnazione(existing.id);
    }

    query = `
      INSERT INTO assegnazioni (comune_id, user_id)
      VALUES ($1, $2)
      RETURNING id
    `;
    const result = await this.db.queryOne(query, [comuneId, userId]);
    return this.getAssegnazione(result.id);
  }

  async deleteAssegnazione(id: number): Promise<void> {
    const result = await this.db.query(
      'DELETE FROM assegnazioni WHERE id = $1',
      [id],
    );
    if (result.rowCount === 0) {
      const { NotFoundException } = await import('@nestjs/common');
      throw new NotFoundException(`Assegnazione ${id} non trovata`);
    }
  }

  private async getAssegnazione(id: number): Promise<Assegnazione> {
    const query = `
      SELECT 
        a.id,
        a.comune_id,
        a.user_id,
        c.nome,
        ${DbHelper.asGeoJSON('c.geom')} as geometry,
        u.name
      FROM assegnazioni a
      JOIN comuni c ON a.comune_id = c.id
      JOIN users u ON a.user_id = u.id
      WHERE a.id = $1
    `;

    const row = await this.db.queryOne(query, [id]);
    return {
      id: row.id,
      comune: {
        id: row.comune_id,
        nome: row.nome,
        geometry: DbHelper.parseGeoJSON(row.geometry),
      },
      user: {
        id: row.user_id,
        name: row.name,
      },
    };
  }
}