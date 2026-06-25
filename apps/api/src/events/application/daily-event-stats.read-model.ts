export const DAILY_EVENT_STATS_READ_MODEL = Symbol('DailyEventStatsReadModel');

export interface StatsQuery {
  timeZone: string;
  from: string;
  to: string;
}

export interface DailyStatRow {
  date: string;
  count: number;
  averageLatencyMs: number;
}

export interface TypeStatRow {
  eventType: string;
  count: number;
  processingLatencyTotalMs: number;
}

export interface DailyEventStatsReadModel {
  groupByDay(query: StatsQuery): Promise<DailyStatRow[]>;
  groupByType(query: StatsQuery): Promise<TypeStatRow[]>;
}
