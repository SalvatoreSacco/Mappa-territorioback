import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../../common/database/database.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.db.queryOne(
      'SELECT id, email, password_hash FROM admin_users WHERE email = $1',
      [dto.email.toLowerCase()],
    );

    if (!user) {
      // Tempo costante per evitare timing attack
      await bcrypt.compare(dto.password, '$2b$12$invalidhashpadding000000000000000000000000000000000000');
      throw new UnauthorizedException('Credenziali non valide');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.password_hash);
    if (!passwordValid) {
      throw new UnauthorizedException('Credenziali non valide');
    }

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
