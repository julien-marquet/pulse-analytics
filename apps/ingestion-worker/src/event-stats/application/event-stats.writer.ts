import { Event } from '@app/events-domain';

export const EVENT_STATS_WRITER = Symbol('EventStatsWriter');

export interface EventStatsWriter {
  save(event: Event, timezone: string): Promise<void>;
}
