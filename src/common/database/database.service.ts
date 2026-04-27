import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';
import * as fs from 'fs';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);
  private pool: Pool;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is required');
    }
    this.pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }

  async onModuleInit() {
    await this.initializeDatabase();
  }

  private async initializeDatabase(): Promise<void> {
    try {
      const initSql = fs.readFileSync('src/db/init.sql', 'utf-8');
      const statements = initSql
        .split(';')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      for (const statement of statements) {
        try {
          await this.pool.query(statement);
        } catch (error: any) {
          if (
            !error.message.includes('already exists') &&
            !error.message.includes('does not exist')
          ) {
            this.logger.error('Migration error:', statement, error.message);
          }
        }
      }

      // Seed dati di esempio se la tabella users è vuota
      const users = await this.pool.query('SELECT COUNT(*) FROM users');
      if (users.rows[0].count === '0') {
        const seedSql = fs.readFileSync('src/db/seed.sql', 'utf-8');
        const seedStatements = seedSql
          .split(';')
          .map((s) => s.trim())
          .filter((s) => s.length > 0);

        for (const statement of seedStatements) {
          try {
            await this.pool.query(statement);
          } catch (error: any) {
            this.logger.error('Seed error:', error.message);
          }
        }
      }

      // Crea admin di default se non ne esiste nessuno
      const adminCount = await this.pool.query(
        'SELECT COUNT(*) FROM admin_users',
      );
      if (adminCount.rows[0].count === '0') {
        const email =
          process.env.ADMIN_EMAIL || 'admin@mappaback.it';
        const password = process.env.ADMIN_DEFAULT_PASSWORD || 'changeme123';
        const hash = await bcrypt.hash(password, 12);
        await this.pool.query(
          'INSERT INTO admin_users (email, password_hash) VALUES ($1, $2)',
          [email, hash],
        );
        this.logger.warn(
          `Admin creato: ${email} — cambia la password immediatamente!`,
        );
      }

      this.logger.log('Database inizializzato');
    } catch (error) {
      this.logger.error('Inizializzazione database fallita:', error);
      throw error;
    }
  }

  async query(text: string, params?: any[]): Promise<QueryResult> {
    return this.pool.query(text, params);
  }

  async queryOne(text: string, params?: any[]): Promise<any> {
    const result = await this.pool.query(text, params);
    return result.rows[0] || null;
  }

  async queryAll(text: string, params?: any[]): Promise<any[]> {
    const result = await this.pool.query(text, params);
    return result.rows;
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
