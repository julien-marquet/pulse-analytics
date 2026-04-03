export type GetStatsByDayResponse = {
  eventType: string;
  count: number;
}[];

export type GetStatsByTypeResponse = {
  date: string;
  count: number;
}[];

type EventResponseDto = {
  type: string;
  id: string;
  receivedAt: Date;
  emittedAt: Date;
  processedAt: Date;
  properties: Record<string, any>;
  latencies: {
    ingestionLatencyMs: number;
    processingLatencyMs: number;
    totalLatencyMs: number;
  };
};

export type GetEventsResponse = {
  page: number;
  pageSize: number;
  total: number;
  data: EventResponseDto[];
};

export type GetStatsOverviewResponse = {};
