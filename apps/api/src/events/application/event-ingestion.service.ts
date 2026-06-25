import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { EventCandidate } from '@app/events-domain';
import { EVENT_PUBLISHER, type EventPublisher } from './event.publisher';

export interface CreateEventQuery {
  type: string;
  emittedAt: Date;
  properties: Record<string, unknown>;
}

@Injectable()
export class EventsIngestionService {
  constructor(
    @Inject(EVENT_PUBLISHER) private readonly eventPublisher: EventPublisher,
  ) {}

  public async addEvent(query: CreateEventQuery) {
    const candidate = new EventCandidate({
      id: randomUUID(),
      type: query.type,
      properties: query.properties,
      emittedAt: query.emittedAt,
    });

    await this.eventPublisher.publish(candidate);
  }
}
