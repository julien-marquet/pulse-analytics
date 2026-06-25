import { Event } from '@app/events-domain';

export const EVENT_FINDER = Symbol('EventFinder');

export interface EventQuery {
  page: number;
  pageSize: number;
  type?: string[];
  from?: Date;
  to?: Date;
  sortBy?: 'emittedAt' | 'type';
  sortAsc?: boolean;
}

export interface EventFinder {
  getTypes(): Promise<string[]>;
  findMany(query: EventQuery): Promise<{ data: Event[]; total: number }>;
  findLatestEmittedAt(from?: string, to?: string): Promise<Date | null>;
}
