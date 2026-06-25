import { DatePrismaConverter } from '@app/common';
import { PrismaService } from '../../prisma.service';
import {
  DailyStatRow,
  DailyEventStatsReadModel,
  StatsQuery,
  TypeStatRow,
} from '../application/daily-event-stats.read-model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DailyEventStatsPrismaReadModel implements DailyEventStatsReadModel {
  constructor(private readonly prisma: PrismaService) {}

  async groupByDay(query: StatsQuery): Promise<DailyStatRow[]> {
    const res = await this.prisma.dailyEventStat.groupBy({
      by: 'date',
      where: {
        date: {
          lte: DatePrismaConverter.toPrisma(query.to),
          gte: DatePrismaConverter.toPrisma(query.from),
        },
        timeZone: query.timeZone,
      },
      _sum: { count: true, processingLatencyTotalMs: true },
      orderBy: { date: 'asc' },
    });
    return res.map((r) => ({
      date: DatePrismaConverter.fromPrismaToDateString(r.date),
      count: r._sum.count ?? 0,
      averageLatencyMs: r._sum.count
        ? (r._sum.processingLatencyTotalMs ?? 0) / r._sum.count
        : 0,
    }));
  }
  async groupByType(query: StatsQuery): Promise<TypeStatRow[]> {
    const res = await this.prisma.dailyEventStat.groupBy({
      by: 'eventType',
      where: {
        date: {
          lte: DatePrismaConverter.toPrisma(query.to),
          gte: DatePrismaConverter.toPrisma(query.from),
        },
        timeZone: query.timeZone,
      },
      _sum: { count: true, processingLatencyTotalMs: true },
      orderBy: {
        _sum: { count: 'desc' },
      },
    });
    return res.map((r) => ({
      eventType: r.eventType,
      count: r._sum.count ?? 0,
      processingLatencyTotalMs: r._sum.processingLatencyTotalMs ?? 0,
    }));
  }
}
