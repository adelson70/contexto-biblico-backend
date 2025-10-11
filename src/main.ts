import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Aplica interceptor global para padronizar respostas de sucesso
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Aplica filter global para padronizar respostas de erro
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Contexto Biblico API')
    .setDescription('API do Contexto Biblico')
    .setVersion('1.0')
    .addTag('contexto-biblico')
    .build();
  
    const document = SwaggerModule.createDocument(app, config);
  
  SwaggerModule.setup('docs', app, document, {customSiteTitle: 'Contexto Biblico API'});

  await app.listen(process.env.PORT ?? 5000)
    .then(() => {
      Logger.verbose('Servidor escutando na porta 5000')
    })
}
bootstrap();
