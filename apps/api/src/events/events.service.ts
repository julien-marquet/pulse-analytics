import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { EventDto } from './events.dto';
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
    return this.prisma.dailyEventsStats.findMany({
      where: { date: { equals: startOfDayUTC }, timeZone },
      orderBy: { date: 'desc' },
    });
  }

  private generateEventId() {
    return randomUUID({});
  }
}
