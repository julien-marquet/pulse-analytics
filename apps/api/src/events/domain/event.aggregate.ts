import { EventData } from '@app/contracts';

type DbEventData = {
  id: string;
  receivedAt: Date;
  processedAt: Date;
  latencies: {
    ingestionLatencyMs: number;
    processingLatencyMs: number;
    totalLatencyMs: number;
  };
};

export type Event = EventData & DbEventData;
