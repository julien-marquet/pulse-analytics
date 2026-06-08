import { type Event as DbEvent } from '@app/database';
import { Event } from '../event.aggregate';

export function addLatenciesToDbEvents(data: DbEvent[]): Event[] {
  return data.map((dbEvent) => {
    const ingestionLatencyMs =
      new Date(dbEvent.receivedAt).valueOf() -
      new Date(dbEvent.emittedAt).valueOf();
    const processingLatencyMs =
      new Date(dbEvent.processedAt).valueOf() -
      new Date(dbEvent.receivedAt).valueOf();
    return {
      ...dbEvent,
      latencies: {
        ingestionLatencyMs,
        processingLatencyMs,
        totalLatencyMs: ingestionLatencyMs + processingLatencyMs,
      },
    } as unknown as Event;
  });
}
