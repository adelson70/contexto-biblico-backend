import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PesquisaModule } from '../pesquisa/pesquisa.module';
import { ReferenciaModule } from '../referencia/referencia.module';
import { ComentarioModule } from '../comentario/comentario.module';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { StatsModule } from '../stats/stats.module';

@Module({
  imports: [PrismaModule, PesquisaModule, ReferenciaModule, ComentarioModule, AuthModule, StatsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
