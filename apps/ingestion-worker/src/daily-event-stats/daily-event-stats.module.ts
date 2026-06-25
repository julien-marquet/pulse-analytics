import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { DailyEventStatsPrismaRepository } from './infrastructure/daily-event-stats.prisma.repository';
import { DAILY_EVENT_STATS_REPOSITORY } from './application/daily-event-stats.repository';
import { DailyEventStatsService } from './application/daily-event-stats.service';

@Module({
  providers: [
    PrismaService,
    {
      provide: DAILY_EVENT_STATS_REPOSITORY,
      useClass: DailyEventStatsPrismaRepository,
    },
    DailyEventStatsService,
  ],
})
export class DailyEventStatsModule {}
