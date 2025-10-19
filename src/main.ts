import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.gurad';
import { corsConfig } from './config/cors.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { NextFunction, Request } from 'express';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // serve static file or uploaded file
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  // parse cookies
  app.use(cookieParser());

  // Global JWT guard
  const reflector = app.get(Reflector);
  // Apply JWT guard globally
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  // enable validate
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  //enable cors
  app.enableCors(corsConfig);

  app.use((req: Request, res, next: NextFunction) => {
    console.log(
      `[${new Date().toISOString()}] Incoming request: ${req.method} ${req.originalUrl}`,
    );
    next();
  });

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
