import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../common/database/database.module';
import { CategorieController } from './categorie.controller';
import { CategorieService } from './categorie.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CategorieController],
  providers: [CategorieService],
  exports: [CategorieService],
})
export class CategorieModule {}
