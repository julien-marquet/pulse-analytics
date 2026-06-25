import { Event } from '@app/events-domain';

export const EVENT_WRITER = Symbol('EventWriter');

export interface EventWriter {
  save(event: Event): Promise<void>;
}
