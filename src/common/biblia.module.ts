import { Module } from '@nestjs/common';
import { BibliaService } from './services/biblia.service';
import { LivrosPermissaoService } from './services/livros-permissao.service';
import { PrismaModule } from '../modules/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [BibliaService, LivrosPermissaoService],
  exports: [BibliaService, LivrosPermissaoService],
})
export class BibliaModule {}

