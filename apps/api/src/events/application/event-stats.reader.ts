export const EVENT_STATS_READER = Symbol('EventStatsReader');

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

export interface EventStatsReader {
  groupByDay(query: StatsQuery): Promise<DailyStatRow[]>;
  groupByType(query: StatsQuery): Promise<TypeStatRow[]>;
}
