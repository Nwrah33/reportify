import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import * as helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('api');
  
  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.use(helmet.default({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));

  const uploadDir = configService.get('UPLOAD_DIR', './uploads');
  app.useStaticAssets(path.resolve(uploadDir), { prefix: '/uploads' });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = configService.get('PORT', 4000);
  await app.listen(port);
  logger.log(`Server running on http://localhost:${port}`);
}
bootstrap();
