import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../common/database/database.service';

export interface User {
  id: number;
  name: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  async getAllUsers(): Promise<User[]> {
    const query = 'SELECT id, name FROM users ORDER BY id';
    return this.db.queryAll(query);
  }

  async getUserById(id: number): Promise<User | null> {
    const query = 'SELECT id, name FROM users WHERE id = $1';
    return this.db.queryOne(query, [id]);
  }

  async createUser(name: string): Promise<User> {
    const query =
      'INSERT INTO users (name) VALUES ($1) RETURNING id, name';
    return this.db.queryOne(query, [name]);
  }
}