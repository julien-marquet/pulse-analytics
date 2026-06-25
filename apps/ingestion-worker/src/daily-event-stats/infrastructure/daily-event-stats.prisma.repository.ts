import { Injectable } from '@nestjs/common';
import { DailyEventStatsRepository } from '../application/daily-event-stats.repository';
import { PrismaService } from '../../prisma.service';
import { Event } from '@app/events-domain';
import { getUTCMidnightForTimezone } from '@app/common';

@Injectable()
export class DailyEventStatsPrismaRepository implements DailyEventStatsRepository {
  constructor(private prisma: PrismaService) {}

  async save(event: Event, timezone: string): Promise<void> {
    const dayDateInTimezone = getUTCMidnightForTimezone(
      event.timing.emittedAt,
      timezone,
    );

    await this.prisma.dailyEventStat.upsert({
      where: {
        date_eventType_timeZone: {
          timeZone: timezone,
          date: dayDateInTimezone,
          eventType: event.type,
        },
      },
      create: {
        timeZone: timezone,
        eventType: event.type,
        count: 1,
        date: dayDateInTimezone,
        processingLatencyTotalMs: event.latencies.processingLatencyMs,
      },
      update: {
        count: { increment: 1 },
        processingLatencyTotalMs: {
          increment: event.latencies.processingLatencyMs,
        },
      },
    });
  }
}
