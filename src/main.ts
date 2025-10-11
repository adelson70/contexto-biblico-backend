import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades não definidas no DTO
      forbidNonWhitelisted: true, // Lança erro se houver propriedades não permitidas
      transform: true, // Transforma os dados para os tipos definidos no DTO
    })
  );

  const config = new DocumentBuilder()
    .setTitle('Contexto Biblico API')
    .setDescription('API do Contexto Biblico')
    .setVersion('1.0')
    .addTag('contexto-biblico')
    .build();
  
    const document = SwaggerModule.createDocument(app, config);
  
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 5000)
    .then(() => {
      Logger.verbose('Servidor escutando na porta 5000')
    })
}
bootstrap();
