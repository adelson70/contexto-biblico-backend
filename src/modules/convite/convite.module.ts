import { Module } from '@nestjs/common';
import { ConviteController } from './convite.controller';
import { ConviteService } from './convite.service';
import { Logger } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ConviteController],
  providers: [ConviteService, Logger],
  exports: [ConviteService],
})
export class ConviteModule {}

