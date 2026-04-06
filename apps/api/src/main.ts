import 'reflect-metadata';
import './environment';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { environment } from './environment';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true }); // enable DI for class-validator
  await app.listen(environment.get('PORT'));
}
bootstrap()
  .then(() => {})
  .catch((err) => {
    console.error('Root error :', err);
  });
