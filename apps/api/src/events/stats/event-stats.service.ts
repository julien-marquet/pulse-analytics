import { Injectable } from '@nestjs/common';
import { DatePrismaConverter } from '@app/common';
import { PrismaService } from '../../prisma.service';
import { BuildStatsOverview } from './event-stats.helper';

@Injectable()
export class EventsStatsService {
  constructor(private readonly prisma: PrismaService) {}

  public async GetStatsByDay(timeZone: string, from: string, to: string) {
    const res = await this.prisma.dailyEventStat.groupBy({
      by: 'date',
      where: {
        date: {
          lte: DatePrismaConverter.toPrisma(to),
          gte: DatePrismaConverter.toPrisma(from),
        },
        timeZone,
      },
      _sum: { count: true },
      orderBy: { date: 'asc' },
    });

    return res.map((r) => ({
      count: r._sum.count ?? 0,
      date: DatePrismaConverter.fromPrismaToDateString(r.date),
    }));
  }

  public async GetStatsOverview(
    timeZone: string,
    from: string,
    to: string,
    nSelectedTopEvents: number,
  ) {
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

    return BuildStatsOverview(
      entries,
      lastEvent?.emittedAt,
      nSelectedTopEvents,
    );
  }

  public async GetStatsByType(
    eventType: string,
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
}
