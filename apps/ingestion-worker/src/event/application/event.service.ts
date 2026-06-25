import { Inject, Injectable } from '@nestjs/common';
import { Event, EventCandidate } from '@app/events-domain';
import { randomUUID } from 'node:crypto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT_WRITER, type EventWriter } from './event.writer';

@Injectable()
export class EventService {
  constructor(
    @Inject(EVENT_WRITER) private readonly writer: EventWriter,
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
