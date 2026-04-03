import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { AddEventRequestDto, EventType } from './dtos/addEvent.request.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { environment } from '../environment';
import { randomUUID } from 'node:crypto';
import { PrismaService } from 'apps/api/src/prisma.service';
import { DateHelpers } from '@app/common';
import {
  type Event as DbEvent,
  type DailyEventStat as DbDailyEventStat,
} from '@app/database';
import { countDistinctValueOfField } from 'apps/api/src/utils/collection.utils';
import { count } from 'node:console';

@Injectable()
export class EventsService {
  constructor(
    @InjectQueue(environment.get('EVENT_QUEUE_NAME'))
    private readonly eventQueue: Queue,
    private readonly prisma: PrismaService,
  ) {}

  public async AddEvent(eventDto: AddEventRequestDto) {
    if (eventDto.id == undefined) {
      eventDto.id = this.generateEventId();
    }
    await this.eventQueue.add(environment.get('ADD_EVENT_JOB_NAME'), eventDto);
  }

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

  public async GetEvents(
    page: number,
    pageSize: number,
    type?: EventType[],
    from?: Date,
    to?: Date,
  ) {
    const filters = this.GetEventsFilter(type, from, to);
    const [data, total] = await Promise.all([
      this.prisma.event.findMany({
        take: pageSize,
        skip: (page - 1) * pageSize,
        where: filters,
      }),
      this.prisma.event.count({ where: filters }),
    ]);
    return {
      data: this.addLatenciesToDbEvents(data),
      total,
    };
  }

  private addLatenciesToDbEvents(data: DbEvent[]) {
    return data.map((dbEvent) => {
      const ingestionLatencyMs =
        new Date(dbEvent.receivedAt).valueOf() -
        new Date(dbEvent.emittedAt).valueOf();
      const processingLatencyMs =
        new Date(dbEvent.processedAt).valueOf() -
        new Date(dbEvent.receivedAt).valueOf();
      return {
        ...dbEvent,
        latencies: {
          ingestionLatencyMs,
          processingLatencyMs,
          totalLatencyMs: ingestionLatencyMs + processingLatencyMs,
        },
      };
    });
  }

  private GetEventsFilter(type?: EventType[], from?: Date, to?: Date) {
    return {
      type: this.GetEventsTypeFilter(type),
      receivedAt: this.GetEventsDateFilter(from, to),
    };
  }

  private GetEventsTypeFilter(type?: EventType[]) {
    if (!type || type.length === 0) return undefined;
    return { in: type };
  }
  private GetEventsDateFilter(from?: Date, to?: Date) {
    return {
      lte: to,
      gte: from,
    };
  }

  /**
   * 
{
  "period": {
    "from": "2026-03-01",
    "to": "2026-04-01",
    "timeZone": "Europe/Paris"
  },
  "totalEvents": 4218, // count events
  "eventTypesCount": 5, // stats by day
  "averageProcessingLatencyMs": 38, // seems costly (store it in stats by day)
  "lastEventAt": "2026-03-31T14:22:10.000Z", // events
  "topEventTypes": [ // stats by day
    { "eventType": "page_viewed", "count": 3100 },
    { "eventType": "button_clicked", "count": 780 },
    { "eventType": "purchase_completed", "count": 96 }
  ]
}
   */
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
      latestEventAt: lastEvent?.emittedAt,
    };
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
        return a.count - b.count;
      })
      .slice(0, selectionSize)
      .map((dbStat) => ({ eventType: dbStat.eventType, count: dbStat.count }));
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

  private generateEventId() {
    return randomUUID({});
  }
}
