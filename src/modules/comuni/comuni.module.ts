import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../common/database/database.module';
import { ComuniService } from './comuni.service';
import { ComuniController } from './comuni.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [ComuniController],
  providers: [ComuniService],
})
export class ComuniModule {}
