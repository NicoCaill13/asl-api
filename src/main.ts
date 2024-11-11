import { HttpAdapterHost, Reflector, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe, ClassSerializerInterceptor, HttpStatus } from '@nestjs/common';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  const config = new DocumentBuilder()
    .setTitle('ASL Campagne Jeanne')
    .setDescription('The ASL API description')
    .setVersion('0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new PrismaClientExceptionFilter(httpAdapter, {
      P2000: HttpStatus.BAD_REQUEST,
      P2002: HttpStatus.CONFLICT,
      P2025: HttpStatus.NOT_FOUND,
      P2003: HttpStatus.BAD_REQUEST,
    })
  );
  const configService = app.get(ConfigService);

  const port = configService.get('APP_PORT');

  app.enableCors({
    origin: 'http://localhost:3100', // URL de ton front-end
    credentials: true, // Si tu utilises des cookies ou des sessions
  });
  await app.listen(port);
}

bootstrap();
