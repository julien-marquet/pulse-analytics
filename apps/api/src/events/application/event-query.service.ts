import { Inject, Injectable } from '@nestjs/common';
import { EVENT_FINDER, type EventFinder } from './event.finder';
import { FindEventsQuery } from './find-events.query';

@Injectable()
export class EventsQueryService {
  constructor(@Inject(EVENT_FINDER) private readonly finder: EventFinder) {}

  public async getTypes() {
    return this.finder.getTypes();
  }

  async getEvents(query: FindEventsQuery) {
    return this.finder.findMany(query);
  }
}
