import { Module } from '@nestjs/common';
import { ComentarioController } from './comentario.controller';
import { ComentarioService } from './comentario.service';
import { Logger } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ComentarioController],
  providers: [ComentarioService, Logger, JwtAuthGuard],
})
export class ComentarioModule {}
