import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsIngestionModule } from './ingestion/event-ingestion.module';
import { EventsQueryModule } from './query/event-query.module';
import { EventsStatsModule } from './stats/event.stats.module';

@Module({
  controllers: [EventsController],
  imports: [EventsIngestionModule, EventsQueryModule, EventsStatsModule],
})
export class EventsModule {}
