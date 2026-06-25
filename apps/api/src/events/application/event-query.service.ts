import { Inject, Injectable } from '@nestjs/common';
import { EVENT_FINDER, type EventFinder, EventQuery } from './event.finder';

@Injectable()
export class EventsQueryService {
  constructor(@Inject(EVENT_FINDER) private readonly reader: EventFinder) {}

  public async getTypes() {
    return this.reader.getTypes();
  }

  async getEvents(query: EventQuery) {
    return this.reader.findMany(query);
  }
}
