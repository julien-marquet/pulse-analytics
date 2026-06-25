import { Injectable } from '@nestjs/common';
import { EventPublisher } from '../application/event.publisher';
import { EventCandidate } from '@app/events-domain';
import { InjectQueue } from '@nestjs/bullmq';
import { environment } from '../../environment';
import { Queue } from 'bullmq';
import { PublishEventDto } from './dtos/publish-event.dto';

@Injectable()
export class EventBullMqPublisher implements EventPublisher {
  constructor(
    @InjectQueue(environment.get('EVENT_QUEUE_NAME'))
    private readonly eventQueue: Queue<PublishEventDto>,
  ) {}
  async publish(candidate: EventCandidate): Promise<void> {
    await this.eventQueue.add(
      environment.get('ADD_EVENT_JOB_NAME'),
      this.serializeEventCandidate(candidate),
      {
        attempts: 2,
        backoff: {
          type: 'fixed',
          delay: 3000,
        },
      },
    );
  }

  private serializeEventCandidate(eventCandidate: EventCandidate) {
    return {
      id: eventCandidate.id,
      type: eventCandidate.type,
      properties: eventCandidate.properties,
      emittedAt: eventCandidate.emittedAt.toISOString(),
    };
  }
}
