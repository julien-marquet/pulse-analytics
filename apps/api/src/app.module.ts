import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { ConfigModule } from '@nestjs/config';
import { validateEnvironment } from '@app/common';
import { ConfigVariables } from './config';
import { IsAllowedTimezoneConstraint } from './utils/is-allowed-timezone.validator';

@Module({
  imports: [
    EventsModule,
    ConfigModule.forRoot({
      validate: (raw) => validateEnvironment(ConfigVariables, raw),
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, IsAllowedTimezoneConstraint],
})
export class AppModule {}
