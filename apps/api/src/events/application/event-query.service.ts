import { Inject, Injectable } from '@nestjs/common';
import {
  EVENT_REPOSITORY,
  EventQuery,
  type EventRepository,
} from '../domain/event.repository';

@Injectable()
export class EventsQueryService {
  constructor(
    @Inject(EVENT_REPOSITORY) private readonly repository: EventRepository,
  ) {}

  public async getTypes() {
    return this.repository.getTypes();
  }

  async getEvents(query: EventQuery) {
    return this.repository.findMany(query);
  }
}
