import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../common/database/database.service';

export interface Categoria {
  id: number;
  nome: string;
}

@Injectable()
export class CategorieService {
  constructor(private readonly db: DatabaseService) {}

  async getAllCategorie(): Promise<Categoria[]> {
    return this.db.queryAll('SELECT id, nome FROM categoria ORDER BY nome');
  }

  async getCategoriaById(id: number): Promise<Categoria> {
    const row = await this.db.queryOne('SELECT id, nome FROM categoria WHERE id = $1', [id]);
    if (!row) throw new NotFoundException(`Categoria ${id} non trovata`);
    return row;
  }

  async createCategoria(nome: string): Promise<Categoria> {
    const existing = await this.db.queryOne('SELECT id FROM categoria WHERE nome = $1', [nome]);
    if (existing) throw new ConflictException(`Categoria "${nome}" esiste già`);

    return this.db.queryOne(
      'INSERT INTO categoria (nome) VALUES ($1) RETURNING id, nome',
      [nome],
    );
  }

  async updateCategoria(id: number, nome: string): Promise<Categoria> {
    const existing = await this.db.queryOne('SELECT id FROM categoria WHERE nome = $1 AND id != $2', [nome, id]);
    if (existing) throw new ConflictException(`Categoria "${nome}" esiste già`);

    const row = await this.db.queryOne(
      'UPDATE categoria SET nome = $1 WHERE id = $2 RETURNING id, nome',
      [nome, id],
    );
    if (!row) throw new NotFoundException(`Categoria ${id} non trovata`);
    return row;
  }

  async deleteCategoria(id: number): Promise<void> {
    const result = await this.db.query('DELETE FROM categoria WHERE id = $1', [id]);
    if (result.rowCount === 0) throw new NotFoundException(`Categoria ${id} non trovata`);
  }
}
