import { Event } from './event.aggregate';

export const EVENT_WRITER = Symbol('IEventWriter'); // a virer

export interface EventWriter {
  save(event: Event): Promise<void>;
}
