import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PesquisaModule } from '../pesquisa/pesquisa.module';
import { ReferenciaModule } from '../referencia/referencia.module';
import { ComentarioModule } from '../comentario/comentario.module';
import { AuthModule } from '../auth/auth.module';
import { ConviteModule } from '../convite/convite.module';
import { PrismaModule } from '../prisma/prisma.module';
import { StatsModule } from '../stats/stats.module';
import { RevisaoModule } from '../revisao/revisao.module';

@Module({
  imports: [PrismaModule, PesquisaModule, ReferenciaModule, ComentarioModule, AuthModule, ConviteModule, StatsModule, RevisaoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
