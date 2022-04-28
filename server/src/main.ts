import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import express from 'express';
import { join } from 'path';
import { AppModule } from './app.module';
const fs = require('fs');

const httpsOptions = {
  key: fs.readFileSync(__dirname + '/../../key.pem'),
  cert: fs.readFileSync(__dirname + '/../../cert.pem'),
};

async function bootstrap() {
  const app= await NestFactory.create(AppModule, {
    httpsOptions,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  // const apps: NestExpressApplication = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.use('/public', express.static(join(__dirname, '../public')));

  app.enableCors({
    origin: true,
    credentials: true,
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
  });

  await app.listen(4000);
}
bootstrap();