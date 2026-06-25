import { Module } from '@nestjs/common';
import { EventsController } from './presentation/events.controller';
import { BullModule } from '@nestjs/bullmq';
import { environment } from '../environment';
import { EventsIngestionService } from './application/event-ingestion.service';
import { PrismaService } from '../prisma.service';
import { EventsQueryService } from './application/event-query.service';
import { DAILY_EVENT_STATS_READ_MODEL } from './application/daily-event-stats.read-model';
import { DailyEventStatsPrismaReadModel } from './infrastructure/event-stats.prisma.read-model';
import { EventsStatsService } from './application/event-stats.service';
import { EventPrismaFinder } from './infrastructure/event.prisma.finder';
import { EVENT_FINDER } from './application/event.finder';

@Module({
  imports: [
    BullModule.registerQueue({ name: environment.get('EVENT_QUEUE_NAME') }),
  ],
  providers: [
    PrismaService,
    { provide: EVENT_FINDER, useClass: EventPrismaFinder },
    {
      provide: DAILY_EVENT_STATS_READ_MODEL,
      useClass: DailyEventStatsPrismaReadModel,
    },
    EventsIngestionService,
    EventsQueryService,
    EventsStatsService,
  ],
  controllers: [EventsController],
})
export class EventsModule {}
