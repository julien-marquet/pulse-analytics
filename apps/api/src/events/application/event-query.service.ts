import { Inject, Injectable } from '@nestjs/common';
import { EVENT_READER, EventQuery, type EventReader } from '@app/events-domain';

@Injectable()
export class EventsQueryService {
  constructor(@Inject(EVENT_READER) private readonly reader: EventReader) {}

  public async getTypes() {
    return this.reader.getTypes();
  }

  async getEvents(query: EventQuery) {
    return this.reader.findMany(query);
  }
}
