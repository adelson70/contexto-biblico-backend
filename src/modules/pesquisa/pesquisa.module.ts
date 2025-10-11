import { Logger, Module } from '@nestjs/common';
import { PesquisaController } from './pesquisa.controller';
import { PesquisaService } from './pesquisa.service';
import { PrismaModule } from '../prisma/prisma.module';
import { RegistroPesquisaInterceptor } from '../../common/interceptors/registro-pesquisa.interceptor';

@Module({
  imports: [PrismaModule],
  controllers: [PesquisaController],
  providers: [PesquisaService, Logger, RegistroPesquisaInterceptor],
})
export class PesquisaModule {}
