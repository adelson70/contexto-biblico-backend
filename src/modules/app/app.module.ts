import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PesquisaModule } from '../pesquisa/pesquisa.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, PesquisaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
