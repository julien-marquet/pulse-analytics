import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { EventStatsPrismaWriter } from './infrastructure/event-stats.prisma.writer';
import { EVENT_STATS_WRITER } from './application/event-stats.writer';
import { EventStatsService } from './application/event-stats.service';

@Module({
  providers: [
    PrismaService,
    { provide: EVENT_STATS_WRITER, useClass: EventStatsPrismaWriter },
    EventStatsService,
  ],
})
export class EventStatsModule {}
