import 'reflect-metadata';
import './environment';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { environment } from './environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(environment.get('PORT'));
}
bootstrap()
  .then(() => {})
  .catch((err) => {
    console.error('Root error :', err);
  });
