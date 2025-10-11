import { Module } from '@nestjs/common';
import { AppController } from './comentario.controller';
import { AppService } from './comentario.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
