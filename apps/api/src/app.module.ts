import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { TypedConfigModule } from '@app/common';
import { ConfigVariables } from './config';
import { IsAllowedTimezoneConstraint } from './utils/is-allowed-timezone.validator';

@Module({
  imports: [EventsModule, TypedConfigModule.forRoot(ConfigVariables)],
  controllers: [AppController],
  providers: [AppService, IsAllowedTimezoneConstraint],
})
export class AppModule {}
