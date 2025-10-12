import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { PrismaModule } from '../prisma/prisma.module';
import { Logger } from '@nestjs/common';

@Module({
  imports: [PrismaModule],
  controllers: [StatsController],
  providers: [StatsService, Logger],
})
export class StatsModule {}
