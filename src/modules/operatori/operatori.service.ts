import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../common/database/database.service';

export interface Operatore {
  id: number;
  nome: string;
  cognome: string;
  categoria: { id: number; nome: string };
  comune: { id: number; nome: string };
}

@Injectable()
export class OperatoriService {
  constructor(private readonly db: DatabaseService) {}

  private readonly baseQuery = `
    SELECT
      o.id,
      o.nome,
      o.cognome,
      c.id   AS categoria_id,
      c.nome AS categoria_nome,
      cm.id  AS comune_id,
      cm.nome AS comune_nome
    FROM operatori o
    JOIN categoria c  ON o.categoria_id = c.id
    JOIN comuni   cm ON o.comune_id     = cm.id
  `;

  private mapRow(row: any): Operatore {
    return {
      id: row.id,
      nome: row.nome,
      cognome: row.cognome,
      categoria: { id: row.categoria_id, nome: row.categoria_nome },
      comune: { id: row.comune_id, nome: row.comune_nome },
    };
  }

  async getAllOperatori(): Promise<Operatore[]> {
    const rows = await this.db.queryAll(`${this.baseQuery} ORDER BY o.nome`);
    return rows.map(this.mapRow);
  }

  async getOperatoreById(id: number): Promise<Operatore> {
    const row = await this.db.queryOne(`${this.baseQuery} WHERE o.id = $1`, [id]);
    if (!row) throw new NotFoundException(`Operatore ${id} non trovato`);
    return this.mapRow(row);
  }

  async createOperatore(nome: string, cognome: string, categoriaId: number, comuneId: number): Promise<Operatore> {
    await this.assertCategoriaExists(categoriaId);
    await this.assertComuneExists(comuneId);

    const result = await this.db.queryOne(
      'INSERT INTO operatori (nome, cognome, categoria_id, comune_id) VALUES ($1, $2, $3, $4) RETURNING id',
      [nome, cognome, categoriaId, comuneId],
    );
    return this.getOperatoreById(result.id);
  }

  async updateOperatore(
    id: number,
    nome: string,
    cognome: string,
    categoriaId: number,
    comuneId: number,
  ): Promise<Operatore> {
    await this.assertCategoriaExists(categoriaId);
    await this.assertComuneExists(comuneId);

    const result = await this.db.queryOne(
      `UPDATE operatori
       SET nome = $1, cognome = $2, categoria_id = $3, comune_id = $4
       WHERE id = $5
       RETURNING id`,
      [nome, cognome, categoriaId, comuneId, id],
    );
    if (!result) throw new NotFoundException(`Operatore ${id} non trovato`);
    return this.getOperatoreById(id);
  }

  async deleteOperatore(id: number): Promise<void> {
    const result = await this.db.query('DELETE FROM operatori WHERE id = $1', [id]);
    if (result.rowCount === 0) throw new NotFoundException(`Operatore ${id} non trovato`);
  }

  private async assertCategoriaExists(id: number): Promise<void> {
    const row = await this.db.queryOne('SELECT id FROM categoria WHERE id = $1', [id]);
    if (!row) throw new NotFoundException(`Categoria ${id} non trovata`);
  }

  private async assertComuneExists(id: number): Promise<void> {
    const row = await this.db.queryOne('SELECT id FROM comuni WHERE id = $1', [id]);
    if (!row) throw new NotFoundException(`Comune ${id} non trovato`);
  }
}
