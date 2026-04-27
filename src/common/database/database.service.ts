import { Injectable, OnModuleInit } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';
import * as fs from 'fs';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private pool: Pool;

  constructor() {
    const connectionString =
      process.env.DATABASE_URL ||
      'postgresql://neondb_owner:***REMOVED***@ep-rough-violet-amadxv6h-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
    this.pool = new Pool({
      connectionString,
    });
  }

  async onModuleInit() {
    await this.initializeDatabase();
  }

  private async initializeDatabase(): Promise<void> {
    try {
      // Run init migrations
      const initSql = fs.readFileSync('src/db/init.sql', 'utf-8');
      const statements = initSql
        .split(';')
        .map((stmt) => stmt.trim())
        .filter((stmt) => stmt.length > 0);

      for (const statement of statements) {
        try {
          await this.pool.query(statement);
        } catch (error: any) {
          // Ignore if extension already exists
          if (
            !error.message.includes('already exists') &&
            !error.message.includes('does not exist')
          ) {
            console.error('Error executing migration:', statement, error);
          }
        }
      }

      // Run seed data if tables are empty
      const users = await this.pool.query('SELECT COUNT(*) FROM users');
      if (users.rows[0].count === '0') {
        const seedSql = fs.readFileSync('src/db/seed.sql', 'utf-8');
        const seedStatements = seedSql
          .split(';')
          .map((stmt) => stmt.trim())
          .filter((stmt) => stmt.length > 0);

        for (const statement of seedStatements) {
          try {
            await this.pool.query(statement);
          } catch (error) {
            console.error('Error executing seed:', statement, error);
          }
        }
      }

      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization failed:', error);
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
