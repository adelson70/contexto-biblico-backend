import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PesquisaModule } from '../pesquisa/pesquisa.module';

@Module({
  imports: [PesquisaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
