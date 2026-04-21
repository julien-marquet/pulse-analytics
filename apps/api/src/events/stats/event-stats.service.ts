import { Injectable } from '@nestjs/common';
import { DatePrismaConverter, TypedConfigService } from '@app/common';
import { PrismaService } from '../../prisma.service';
import { BuildStatsOverview } from './event-stats.helper';
import { ConfigVariables } from '../../config';

@Injectable()
export class EventsStatsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: TypedConfigService<ConfigVariables>,
  ) {}

  public GetTimeZones() {
    return this.config.get('TIMEZONES');
  }

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

  public async GetStatsByType(timeZone: string, from: string, to: string) {
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
        type: i.eventType,
        count: i._sum.count ?? 0,
      };
    });

    return {
      total,
      types,
    };
  }
}
