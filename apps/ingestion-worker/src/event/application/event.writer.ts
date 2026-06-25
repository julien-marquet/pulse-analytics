import { Event } from '../../../../../packages/events-domain/src/event.aggregate';

export const EVENT_WRITER = Symbol('IEventWriter'); // a virer

export interface EventWriter {
  save(event: Event): Promise<void>;
}
