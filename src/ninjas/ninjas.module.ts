import { Module } from '@nestjs/common';
import { NinjasService } from './ninjas.service';
import { NinjasController } from './ninjas.controller';

@Module({
  controllers: [NinjasController],
  providers: [NinjasService],
})
export class NinjasModule {}
