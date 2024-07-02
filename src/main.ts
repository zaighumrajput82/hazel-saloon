import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Global pipes setup
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // Serve static files from the 'public' directory
  app.useStaticAssets(join(__dirname, '..', 'public'));

  await app.listen(3333);
}
bootstrap();
