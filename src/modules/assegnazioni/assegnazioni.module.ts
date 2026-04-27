import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../common/database/database.module';
import { AssegnazioniService } from './assegnazioni.service';
import { AssegnazioniController } from './assegnazioni.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [AssegnazioniController],
  providers: [AssegnazioniService],
})
export class AssegnazioniModule {}
