import { Event } from './event.aggregate';

export const EVENT_REPOSITORY = Symbol('IEventRepository');

export interface EventQuery {
  page: number;
  pageSize: number;
  type?: string[];
  from?: Date;
  to?: Date;
  sortBy?: 'emittedAt' | 'type';
  sortAsc?: boolean;
}

export interface EventRepository {
  getTypes(): Promise<string[]>;
  findMany(query: EventQuery): Promise<{ data: Event[]; total: number }>;
  findLatestEmittedAt(from?: string, to?: string): Promise<Date | null>;
}
