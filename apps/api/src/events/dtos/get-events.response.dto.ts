type EventResponseDto = {
  type: string;
  id: string;
  receivedAt: Date;
  emittedAt: Date;
  processedAt: Date;
  properties: Record<string, unknown>;
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
