import { Module } from '@nestjs/common';
import { DatabaseModule } from './common/database/database.module';
import { ComuniModule } from './modules/comuni/comuni.module';
import { UsersModule } from './modules/users/users.module';
import { AssegnazioniModule } from './modules/assegnazioni/assegnazioni.module';
import { ImportModule } from './modules/import/import.module';
import { CategorieModule } from './modules/categorie/categorie.module';
import { OperatoriModule } from './modules/operatori/operatori.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [DatabaseModule, ComuniModule, UsersModule, AssegnazioniModule, ImportModule, CategorieModule, OperatoriModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}