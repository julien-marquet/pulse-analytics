import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { randomUUID } from 'node:crypto';
import { environment } from 'apps/api/src/environment';
import type { CreateEventRequestDto } from 'apps/api/src/events/dtos/create-event.request.dto';

@Injectable()
export class EventsIngestionService {
  constructor(
    @InjectQueue(environment.get('EVENT_QUEUE_NAME'))
    private readonly eventQueue: Queue,
  ) {}

  public async AddEvent(eventDto: CreateEventRequestDto) {
    if (eventDto.id == undefined) {
      eventDto.id = this.generateEventId();
    }
    await this.eventQueue.add(environment.get('ADD_EVENT_JOB_NAME'), eventDto);
  }

  private generateEventId() {
    return randomUUID({});
  }
}
