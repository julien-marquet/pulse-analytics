import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { EventDto, EventType } from './events.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { environment } from '../environment';
import { randomUUID } from 'node:crypto';
import { PrismaService } from 'apps/api/src/prisma.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectQueue(environment.get('EVENT_QUEUE_NAME'))
    private readonly eventQueue: Queue,
    private readonly prisma: PrismaService,
  ) {}

  public async AddEvent(eventDto: EventDto) {
    if (eventDto.id == undefined) {
      eventDto.id = this.generateEventId();
    }
    await this.eventQueue.add(environment.get('ADD_EVENT_JOB_NAME'), eventDto);
  }

  public async GetStatsByDay(startOfDayUTC: Date, timeZone: string) {
    const res = await this.prisma.dailyEventStat.findMany({
      select: {
        count: true,
        eventType: true,
      },
      where: { date: { equals: startOfDayUTC }, timeZone },
      orderBy: { eventType: 'asc' },
    });
    return res.map((r) => ({ count: r.count, eventType: r.eventType }));
  }

  public async GetEvents(page: number, pageSize: number) {
    const [data, total] = await Promise.all([
      this.prisma.event.findMany({
        take: pageSize,
        skip: (page - 1) * pageSize,
      }),
      this.prisma.event.count(),
    ]);
    return {
      data,
      total,
    };
  }

  public async GetStatsByType(
    eventType: EventType,
    fromStartOfDayUTC: Date,
    toStartOfDayUTC: Date,
  ) {
    const res = await this.prisma.dailyEventStat.findMany({
      select: {
        count: true,
        date: true,
      },
      where: {
        eventType,
        timeZone: 'UTC',
        date: { gte: fromStartOfDayUTC, lte: toStartOfDayUTC },
      },
      orderBy: { date: 'desc' },
    });
    return res;
  }

  private generateEventId() {
    return randomUUID({});
  }
}
