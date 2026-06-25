import { Event } from '@app/events-domain';
import { FindEventsQuery } from './find-events.query';

export const EVENT_FINDER = Symbol('EventFinder');

export const SORTABLE_EVENT_FIELDS = ['emittedAt', 'type'] as const;
export type SortableEventField = (typeof SORTABLE_EVENT_FIELDS)[number];

export interface EventFinder {
  getTypes(): Promise<string[]>;
  findMany(query: FindEventsQuery): Promise<{ data: Event[]; total: number }>;
  findLatestEmittedAt(from?: string, to?: string): Promise<Date | null>;
}
