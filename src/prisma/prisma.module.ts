import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { globSync } from 'fs';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
