import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { AddEventRequestDto, EventType } from './dtos/addEvent.request.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { environment } from '../environment';
import { randomUUID } from 'node:crypto';
import { PrismaService } from 'apps/api/src/prisma.service';
import { DateHelpers } from '@app/common';
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
      data,
      total,
    };
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
