import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from './common/database/database.module';
import { ComuniModule } from './modules/comuni/comuni.module';
import { UsersModule } from './modules/users/users.module';
import { AssegnazioniModule } from './modules/assegnazioni/assegnazioni.module';
import { ImportModule } from './modules/import/import.module';
import { CategorieModule } from './modules/categorie/categorie.module';
import { OperatoriModule } from './modules/operatori/operatori.module';
import { AuthModule } from './modules/auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Rate limiting globale: max 100 req ogni 60s per IP
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    DatabaseModule,
    AuthModule,
    ComuniModule,
    UsersModule,
    AssegnazioniModule,
    ImportModule,
    CategorieModule,
    OperatoriModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
