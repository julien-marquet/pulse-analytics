import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestsController } from './tests/tests.controller';

@Module({
  imports: [],
  controllers: [AppController, TestsController],
  providers: [AppService],
})
export class AppModule {}
