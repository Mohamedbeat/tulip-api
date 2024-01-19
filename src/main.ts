import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.enableCors({ origin: '*' });

  app.use(
    '/uploads/profilePictures',
    express.static(path.join(process.cwd(), 'uploads', 'profilePictures')),
  );
  await app.listen(3000);
}
bootstrap();
