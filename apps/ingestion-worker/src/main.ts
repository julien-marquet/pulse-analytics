import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    bufferLogs: true, // output Bootstrap nestjs log with pino
  });
  app.useLogger(app.get(Logger));
}
bootstrap()
  .then(() => {})
  .catch((err) => {
    console.error('Root error :', err);
  });
