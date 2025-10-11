import { Logger, Module } from '@nestjs/common';
import { PesquisaController } from './pesquisa.controller';
import { PesquisaService } from './pesquisa.service';
import { PrismaModule } from '../prisma/prisma.module';
@Module({
  imports: [PrismaModule],
  controllers: [PesquisaController],
  providers: [PesquisaService, Logger],
})
export class PesquisaModule {}
