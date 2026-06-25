import { Module } from '@nestjs/common';
import { EventsController } from './presentation/events.controller';
import { BullModule } from '@nestjs/bullmq';
import { environment } from '../environment';
import { EventsIngestionService } from './application/event-ingestion.service';
import { PrismaService } from '../prisma.service';
import { EventsQueryService } from './application/event-query.service';
import { EVENT_READER } from '@app/events-domain';
import { EVENT_STATS_READER } from './application/event-stats.reader';
import { EventStatsPrismaReader } from './infrastructure/event-stats.prisma.reader';
import { EventsStatsService } from './application/event-stats.service';
import { EventPrismaReader } from './infrastructure/event.prisma.reader';

@Module({
  imports: [
    BullModule.registerQueue({ name: environment.get('EVENT_QUEUE_NAME') }),
  ],
  providers: [
    PrismaService,
    { provide: EVENT_READER, useClass: EventPrismaReader },
    { provide: EVENT_STATS_READER, useClass: EventStatsPrismaReader },
    EventsIngestionService,
    EventsQueryService,
    EventsStatsService,
  ],
  controllers: [EventsController],
})
export class EventsModule {}
