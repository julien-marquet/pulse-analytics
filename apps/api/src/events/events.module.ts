import { Module } from '@nestjs/common';
import { EventsController } from 'apps/api/src/events/events.controller';
import { EventsIngestionModule } from 'apps/api/src/events/ingestion/event-ingestion.module';
import { EventsQueryModule } from 'apps/api/src/events/query/event-query.module';
import { EventsStatsModule } from 'apps/api/src/events/stats/event.stats.module';

@Module({
  controllers: [EventsController],
  imports: [EventsIngestionModule, EventsQueryModule, EventsStatsModule],
})
export class EventsModule {}
