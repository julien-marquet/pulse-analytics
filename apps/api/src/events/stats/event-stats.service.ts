import { Injectable } from '@nestjs/common';
import { PrismaService } from 'apps/api/src/prisma.service';
import { DateHelpers, EventType } from '@app/common';
import { type DailyEventStat as DbDailyEventStat } from '@app/database';
import { countDistinctValueOfField } from 'apps/api/src/utils/collection.utils';

@Injectable()
export class EventsStatsService {
  constructor(private readonly prisma: PrismaService) {}

  public async GetStatsByDay(dateString: string, timeZone: string) {
    const res = await this.prisma.dailyEventStat.findMany({
      select: {
        count: true,
        eventType: true,
      },
      where: {
        date: { equals: DateHelpers.DatePrismaConverter.toPrisma(dateString) },
        timeZone,
      },
      orderBy: { eventType: 'asc' },
    });
    return res.map((r) => ({ count: r.count, eventType: r.eventType }));
  }

  public async GetStatsOverview(timeZone: string, from: string, to: string) {
    const lastEvent = await this.prisma.event.findFirst({
      orderBy: {
        emittedAt: 'desc',
      },
      where: {
        emittedAt: {
          lte: DateHelpers.DatePrismaConverter.toPrisma(to),
          gte: DateHelpers.DatePrismaConverter.toPrisma(from),
        },
      },
    });
    const entries = await this.prisma.dailyEventStat.findMany({
      where: {
        date: {
          lte: DateHelpers.DatePrismaConverter.toPrisma(to),
          gte: DateHelpers.DatePrismaConverter.toPrisma(from),
        },
        timeZone,
      },
    });

    return {
      totalEvents: entries.reduce((acc, entry) => {
        return acc + entry.count;
      }, 0),
      averageProcessingLatencyMs: this.SumAverageProcessingLatency(entries),
      eventTypesCount: countDistinctValueOfField(entries, 'eventType'),
      topEventTypes: this.GetTopEventTypes(entries, 3),
      latestEventAt: lastEvent?.emittedAt.toISOString(),
    };
  }

  public async GetStatsByType(
    eventType: EventType,
    timeZone: string,
    from?: string,
    to?: string,
  ) {
    const res = await this.prisma.dailyEventStat.findMany({
      select: {
        count: true,
        date: true,
      },
      where: {
        eventType,
        timeZone,
        date: {
          gte: from
            ? DateHelpers.DatePrismaConverter.toPrisma(from)
            : undefined,
          lte: to ? DateHelpers.DatePrismaConverter.toPrisma(to) : undefined,
        },
      },
      orderBy: { date: 'desc' },
    });
    return res.map((i) => ({
      ...i,
      date: DateHelpers.DatePrismaConverter.fromPrismaToDateString(i.date),
    }));
  }

  private SumAverageProcessingLatency(dbStats: DbDailyEventStat[]) {
    let count = 0;
    let averagesSum = 0;

    dbStats.forEach((stat) => {
      count += stat.count;
      averagesSum += stat.processingLatencyTotalMs;
    });

    return averagesSum / count;
  }

  private GetTopEventTypes(dbStats: DbDailyEventStat[], selectionSize: number) {
    return dbStats
      .sort((a, b) => {
        return b.count - a.count;
      })
      .slice(0, selectionSize)
      .map((dbStat) => ({ eventType: dbStat.eventType, count: dbStat.count }));
  }
}
