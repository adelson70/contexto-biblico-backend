import { Module } from '@nestjs/common';
import { RevisaoController } from './revisao.controller';
import { RevisaoService } from './revisao.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [RevisaoController],
  providers: [RevisaoService],
  exports: [RevisaoService],
})
export class RevisaoModule {}
