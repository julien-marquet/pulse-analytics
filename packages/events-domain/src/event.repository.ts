import { Event } from '@app/events-domain';

export const EVENT_REPOSITORY = Symbol('EventRepository');

export interface EventRepository {
  save(event: Event): Promise<void>;
}
