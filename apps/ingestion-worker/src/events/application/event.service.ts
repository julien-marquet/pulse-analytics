import { Inject, Injectable } from '@nestjs/common';
import {
  Event,
  EVENT_REPOSITORY,
  EventCandidate,
  type EventRepository,
} from '@app/events-domain';
import { randomUUID } from 'node:crypto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EventService {
  constructor(
    @Inject(EVENT_REPOSITORY) private readonly writer: EventRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  public async createEvent(
    candidate: EventCandidate,
    receivedAt: Date,
    processedAt: Date,
  ) {
    const event = Event.fromCandidate(
      randomUUID(),
      candidate,
      receivedAt,
      processedAt,
    );
    await this.writer.save(event);
    this.eventEmitter.emit('event.created', event);
  }
}
