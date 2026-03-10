import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOrigins = process.env.CORS_ORIGIN?.split(',')
    ?.map((o) => o.trim().replace(/\/$/, ''))
    ?.filter(Boolean);
  app.enableCors({
    origin: corsOrigins?.length ? corsOrigins : true,
    credentials: true,
  });
  app.setGlobalPrefix('api');
  const port = Number(process.env.PORT) || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`[API] Listening on 0.0.0.0:${port}`);
}

bootstrap().catch((err) => {
  console.error('[API] Bootstrap failed:', err);
  process.exit(1);
});
