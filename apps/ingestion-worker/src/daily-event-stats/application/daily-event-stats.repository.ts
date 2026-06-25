import { Event } from '@app/events-domain';

export const DAILY_EVENT_STATS_REPOSITORY = Symbol('DailyEventStatsRepository');

export interface DailyEventStatsRepository {
  save(event: Event, timezone: string): Promise<void>;
}
