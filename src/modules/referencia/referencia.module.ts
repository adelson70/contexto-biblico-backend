import { Module } from '@nestjs/common';
import { ReferenciaController } from './referencia.controller';
import { ReferenciaService } from './referencia.service';
import { PrismaModule } from '../prisma/prisma.module';
import { Logger } from '@nestjs/common';
@Module({
  imports: [PrismaModule],
  controllers: [ReferenciaController],
  providers: [ReferenciaService, Logger],
})
export class ReferenciaModule {}
