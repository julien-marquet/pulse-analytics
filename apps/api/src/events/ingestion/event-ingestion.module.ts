import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { environment } from '../../environment';
import { EventsIngestionService } from './event-ingestion.service';

@Module({
  imports: [
    BullModule.registerQueue({ name: environment.get('EVENT_QUEUE_NAME') }),
  ],
  providers: [EventsIngestionService],
  exports: [EventsIngestionService],
})
export class EventsIngestionModule {}
