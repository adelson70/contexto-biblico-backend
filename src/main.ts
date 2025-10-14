import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import cookieParser from 'cookie-parser';
import basicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configura o cookie-parser para processar cookies
  app.use(cookieParser());

  // Habilita CORS com credenciais para permitir envio de cookies
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

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

  // criando login e senha para o swagger
  app.use(
    ['/docs', '/docs-json'],
    basicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USER as string]: process.env.SWAGGER_PASSWORD as string,
      },
    })
  )


  const config = new DocumentBuilder()
    .setTitle('Contexto Biblico API')
    .setDescription('API do Contexto Biblico')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addCookieAuth('refresh_token', {
      type: 'apiKey',
      in: 'cookie',
      name: 'refresh_token',
    })
    .build();
  
    const document = SwaggerModule.createDocument(app, config);
  
  SwaggerModule.setup('docs', app, document, {customSiteTitle: 'Contexto Biblico API'});

  await app.listen(process.env.PORT ?? 5000)
    .then(() => {
      Logger.verbose('Servidor escutando na porta 5000')
    })
}
bootstrap();
