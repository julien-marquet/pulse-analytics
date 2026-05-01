import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { randomUUID } from 'node:crypto';
import { CreateEventJobData, EventData } from '@app/contracts';
import { environment } from '../../environment';

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
    await this.eventQueue.add(
      environment.get('ADD_EVENT_JOB_NAME'),
      {
        id,
        ...eventData,
      },
      {
        jobId: id,
        attempts: 2,
        backoff: {
          type: 'fixed',
          delay: 3000,
        },
      },
    );
  }

  private generateEventId() {
    return randomUUID({});
  }
}
