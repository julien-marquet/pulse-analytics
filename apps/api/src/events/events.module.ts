import { Module } from '@nestjs/common';
import { EventsController } from './presentation/events.controller';
import { BullModule } from '@nestjs/bullmq';
import { environment } from '../environment';
import { EventsIngestionService } from './ingestion/event-ingestion.service';
import { PrismaService } from '../prisma.service';
import { EventsQueryService } from './query/event-query.service';
import { EventsStatsService } from './stats/event-stats.service';

@Module({
  imports: [
    BullModule.registerQueue({ name: environment.get('EVENT_QUEUE_NAME') }),
  ],
  providers: [
    EventsIngestionService,
    EventsQueryService,
    EventsStatsService,
    PrismaService,
  ],
  controllers: [EventsController],
})
export class EventsModule {}
