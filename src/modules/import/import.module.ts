import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../common/database/database.module';
import { ImportService } from './import.service';
import { ImportController } from './import.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [ImportController],
  providers: [ImportService],
})
export class ImportModule {}