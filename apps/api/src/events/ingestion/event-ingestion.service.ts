import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { randomUUID } from 'node:crypto';
import { environment } from 'apps/api/src/environment';
import { CreateEventJobData, EventData } from '@app/common';

@Injectable()
export class EventsIngestionService {
  constructor(
    @InjectQueue(environment.get('EVENT_QUEUE_NAME'))
    private readonly eventQueue: Queue<CreateEventJobData>,
  ) {}

  public async AddEvent(id: string | undefined, eventData: EventData) {
    if (id == undefined) {
      id = this.generateEventId();
    }
    await this.eventQueue.add(environment.get('ADD_EVENT_JOB_NAME'), {
      id,
      ...eventData,
    });
  }

  private generateEventId() {
    return randomUUID({});
  }
}
