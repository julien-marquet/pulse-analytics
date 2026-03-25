import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  await NestFactory.createApplicationContext(AppModule);
}
bootstrap()
  .then(() => {})
  .catch((err) => {
    console.error('Root error :', err);
  });
