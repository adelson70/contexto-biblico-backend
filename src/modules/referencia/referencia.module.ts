import { Module } from '@nestjs/common';
import { AppController } from './referencia.controller';
import { AppService } from './referencia.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
