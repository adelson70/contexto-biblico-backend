import { Module } from '@nestjs/common';
import { BibliaService } from './services/biblia.service';

@Module({
  providers: [BibliaService],
  exports: [BibliaService],
})
export class BibliaModule {}

