import { Injectable } from '@nestjs/common';
import { EventType } from '@app/contracts';
import { DatePrismaConverter } from '@app/common';
import { PrismaService } from '../../prisma.service';
import { BuildStatsOverview } from './event-stats.helper';

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

    return BuildStatsOverview(entries, lastEvent?.emittedAt);
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
}
