import { Module } from '@nestjs/common';
import { EventsStatsService } from 'apps/api/src/events/stats/event-stats.service';
import { PrismaService } from 'apps/api/src/prisma.service';

@Module({
  providers: [EventsStatsService, PrismaService],
  exports: [EventsStatsService],
})
export class EventsStatsModule {}
