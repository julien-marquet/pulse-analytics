import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { BullModule } from '@nestjs/bullmq';
import { environment } from '../environment';

@Module({
  controllers: [EventsController],
  imports: [
    BullModule.forRoot({
      connection: { url: environment.get('REDIS_URL') },
    }),
    BullModule.registerQueue({ name: environment.get('EVENT_QUEUE_NAME') }),
  ],
  providers: [EventsService],
})
export class EventsModule {}
