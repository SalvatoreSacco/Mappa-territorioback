import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security headers
  app.use(helmet());

  // CORS — usa variabile d'ambiente in produzione
  const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
    : ['http://localhost:3001'];

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Validazione automatica dei DTO con class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // rimuove campi non dichiarati nel DTO
      forbidNonWhitelisted: true, // restituisce errore se arrivano campi extra
      transform: true,        // converte tipi automaticamente
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
