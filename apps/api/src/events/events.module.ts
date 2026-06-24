import { Module } from '@nestjs/common';
import { EventsController } from './presentation/events.controller';
import { BullModule } from '@nestjs/bullmq';
import { environment } from '../environment';
import { EventsIngestionService } from './application/event-ingestion.service';
import { PrismaService } from '../prisma.service';
import { EventsQueryService } from './application/event-query.service';
import { EVENT_REPOSITORY } from '@app/events-domain';
import { EVENT_STATS_REPOSITORY } from './domain/event-stats.repository';
import { EventPrismaRepository } from './infrastructure/event.prisma.reader';
import { EventStatsPrismaRepository } from './infrastructure/event-stats.prisma.repository';
import { EventsStatsService } from './application/event-stats.service';

@Module({
  imports: [
    BullModule.registerQueue({ name: environment.get('EVENT_QUEUE_NAME') }),
  ],
  providers: [
    PrismaService,
    { provide: EVENT_REPOSITORY, useClass: EventPrismaRepository },
    { provide: EVENT_STATS_REPOSITORY, useClass: EventStatsPrismaRepository },
    EventsIngestionService,
    EventsQueryService,
    EventsStatsService,
  ],
  controllers: [EventsController],
})
export class EventsModule {}
