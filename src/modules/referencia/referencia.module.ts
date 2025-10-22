import { Module } from '@nestjs/common';
import { ReferenciaController } from './referencia.controller';
import { ReferenciaService } from './referencia.service';
import { PrismaModule } from '../prisma/prisma.module';
import { Logger } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ReferenciaController],
  providers: [ReferenciaService, Logger, JwtAuthGuard],
})
export class ReferenciaModule {}
