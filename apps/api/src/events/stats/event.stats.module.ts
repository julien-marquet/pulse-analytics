import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { EventsStatsService } from './event-stats.service';

@Module({
  providers: [EventsStatsService, PrismaService],
  exports: [EventsStatsService],
})
export class EventsStatsModule {}
