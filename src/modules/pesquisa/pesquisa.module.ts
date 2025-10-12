import { Logger, Module } from '@nestjs/common';
import { PesquisaController } from './pesquisa.controller';
import { PesquisaService } from './pesquisa.service';
import { PrismaModule } from '../prisma/prisma.module';
import { RegistroPesquisaInterceptor } from '../../common/interceptors/registro-pesquisa.interceptor';
import { GeolocalizacaoService } from '../../common/services/geolocalizacao.service';
import { BibliaModule } from '../../common/biblia.module';

@Module({
  imports: [PrismaModule, BibliaModule],
  controllers: [PesquisaController],
  providers: [PesquisaService, Logger, RegistroPesquisaInterceptor, GeolocalizacaoService],
  exports: [RegistroPesquisaInterceptor],
})
export class PesquisaModule {}
