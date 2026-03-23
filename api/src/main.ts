import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import helmet from 'helmet';

import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

const requiredEnvVars = [
  'PORT',
  'MONGO_DB_URL',
  'MONGO_DB_NAME',
  'CLERK_SECRET_KEY',
  'CLERK_WEBHOOK_SECRET',
  'CORS_ORIGINS',
] as const;

function validateEnv() {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`,
    );
  }
}

async function initializeServer() {
  validateEnv();

  const app = await NestFactory.create(AppModule, { rawBody: true });
  const logger = new Logger('Bootstrap');

  const origins = process.env.CORS_ORIGINS.split(',').map((o) => o.trim());
  app.enableCors({
    origin: origins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.use(helmet());
  app.use(cookieParser());
  app.use(compression());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
      forbidUnknownValues: true,
    }),
  );

  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT, () => {
    logger.log(`Server running on port ${process.env.PORT}`);
  });
}
initializeServer();
