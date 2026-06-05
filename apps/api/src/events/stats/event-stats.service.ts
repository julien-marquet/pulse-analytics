import { Injectable } from '@nestjs/common';
import { DatePrismaConverter, TypedConfigService } from '@app/common';
import { PrismaService } from '../../prisma.service';
import { ConfigVariables } from '../../config';

@Injectable()
export class EventsStatsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: TypedConfigService<ConfigVariables>,
  ) {}

  public getTimeZones() {
    return this.config.get('TIMEZONES');
  }

  public async getStatsByDay(timeZone: string, from: string, to: string) {
    const res = await this.prisma.dailyEventStat.groupBy({
      by: 'date',
      where: {
        date: {
          lte: DatePrismaConverter.toPrisma(to),
          gte: DatePrismaConverter.toPrisma(from),
        },
        timeZone,
      },
      _sum: { count: true, processingLatencyTotalMs: true },
      orderBy: { date: 'asc' },
    });

    return res.map((r) => ({
      count: r._sum.count ?? 0,
      averageLatencyMs:
        (r._sum.count &&
          (r._sum.processingLatencyTotalMs ?? 0) / (r._sum.count ?? 0)) ??
        0,
      date: DatePrismaConverter.fromPrismaToDateString(r.date),
    }));
  }

  public async getStatsOverview(
    timeZone: string,
    from: string,
    to: string,
    nSelectedTopEvents: number,
  ) {
    const dateFilter = {
      lte: DatePrismaConverter.toPrisma(to),
      gte: DatePrismaConverter.toPrisma(from),
    };

    const [lastEvent, byType] = await Promise.all([
      this.prisma.event.findFirst({
        orderBy: { emittedAt: 'desc' },
        where: { emittedAt: dateFilter },
      }),
      this.prisma.dailyEventStat.groupBy({
        by: 'eventType',
        where: { date: dateFilter, timeZone },
        _sum: { count: true, processingLatencyTotalMs: true },
        orderBy: { _sum: { count: 'desc' } },
      }),
    ]);

    let totalEvents = 0;
    let totalLatencyMs = 0;
    for (const row of byType) {
      totalEvents += row._sum.count ?? 0;
      totalLatencyMs += row._sum.processingLatencyTotalMs ?? 0;
    }

    return {
      totalEvents,
      averageProcessingLatencyMs:
        totalEvents === 0 ? null : totalLatencyMs / totalEvents,
      eventTypesCount: byType.length,
      topEventTypes: byType
        .slice(0, nSelectedTopEvents)
        .map((r) => ({ eventType: r.eventType, count: r._sum.count ?? 0 })),
      latestEventAt: lastEvent?.emittedAt.toISOString(),
    };
  }

  public async getStatsByType(timeZone: string, from: string, to: string) {
    const res = await this.prisma.dailyEventStat.groupBy({
      by: 'eventType',
      where: {
        date: {
          lte: DatePrismaConverter.toPrisma(to),
          gte: DatePrismaConverter.toPrisma(from),
        },
        timeZone,
      },
      _sum: { count: true },
      orderBy: {
        _sum: { count: 'desc' },
      },
    });

    let total = 0;
    const types = res.map((i) => {
      total += i._sum.count ?? 0;
      return {
        eventType: i.eventType,
        count: i._sum.count ?? 0,
      };
    });

    return {
      total,
      types,
    };
  }
}
