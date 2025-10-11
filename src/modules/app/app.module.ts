import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PesquisaModule } from '../pesquisa/pesquisa.module';
import { ReferenciaModule } from '../referencia/referencia.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, PesquisaModule, ReferenciaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
