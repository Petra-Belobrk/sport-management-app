import { Module } from '@nestjs/common';
import { SportController } from './sport.controller';
import { SportService } from './sport.service';

@Module({
  controllers: [SportController],
  providers: [SportService],
  exports: [SportService],
})
export class SportModule {}
