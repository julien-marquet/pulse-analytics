import { Injectable } from '@nestjs/common';
import { EventType } from '@app/contracts';
import { type DailyEventStat as DbDailyEventStat } from '@app/database';
import { DatePrismaConverter } from '@app/common';
import { PrismaService } from '../../prisma.service';
import { countDistinctValueOfField } from '../../utils/collection.utils';

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
        date: { equals: DatePrismaConverter.toPrisma(dateString) },
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
          lte: DatePrismaConverter.toPrisma(to),
          gte: DatePrismaConverter.toPrisma(from),
        },
      },
    });
    const entries = await this.prisma.dailyEventStat.findMany({
      where: {
        date: {
          lte: DatePrismaConverter.toPrisma(to),
          gte: DatePrismaConverter.toPrisma(from),
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
          gte: from ? DatePrismaConverter.toPrisma(from) : undefined,
          lte: to ? DatePrismaConverter.toPrisma(to) : undefined,
        },
      },
      orderBy: { date: 'desc' },
    });
    return res.map((i) => ({
      ...i,
      date: DatePrismaConverter.fromPrismaToDateString(i.date),
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
    const eventTypesTotals = dbStats.reduce<Record<string, number>>(
      (acc, curr) => {
        if (acc[curr.eventType] === undefined) {
          acc[curr.eventType] = curr.count;
        } else {
          acc[curr.eventType] += curr.count;
        }
        return acc;
      },
      {},
    );

    return Object.entries(eventTypesTotals)
      .sort(([_, aCount], [__, bCount]) => {
        return bCount - aCount;
      })
      .slice(0, selectionSize)
      .map(([eventType, count]) => ({ eventType, count }));
  }
}
