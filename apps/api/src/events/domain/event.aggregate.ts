import { EventData } from '@app/contracts';
import { Latency } from './value-objects/latency';

type DbEventData = {
  id: string;
  receivedAt: Date;
  processedAt: Date;
  latencies: Latency;
};

export type Event = EventData & DbEventData;
