import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../common/database/database.module';
import { OperatoriController } from './operatori.controller';
import { OperatoriService } from './operatori.service';

@Module({
  imports: [DatabaseModule],
  controllers: [OperatoriController],
  providers: [OperatoriService],
})
export class OperatoriModule {}
