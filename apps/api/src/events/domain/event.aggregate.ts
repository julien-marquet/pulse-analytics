import { type Event as DbEvent } from '@app/database';
import { Latency } from './value-objects/latency';

export class Event {
  readonly id: string;
  readonly type: string;
  readonly emittedAt: Date;
  readonly receivedAt: Date;
  readonly processedAt: Date;
  readonly properties: Record<string, unknown>;
  readonly latencies: Latency;

  private constructor(data: {
    id: string;
    type: string;
    emittedAt: Date;
    receivedAt: Date;
    processedAt: Date;
    properties: Record<string, unknown>;
    latencies: Latency;
  }) {
    this.id = data.id;
    this.type = data.type;
    this.emittedAt = data.emittedAt;
    this.receivedAt = data.receivedAt;
    this.processedAt = data.processedAt;
    this.properties = data.properties;
    this.latencies = data.latencies;
  }

  static fromDb(this: void, row: DbEvent): Event {
    return new Event({
      id: row.id,
      type: row.type,
      emittedAt: row.emittedAt,
      receivedAt: row.receivedAt,
      processedAt: row.processedAt,
      properties: (row.properties ?? {}) as Record<string, unknown>,
      latencies: new Latency(row.emittedAt, row.receivedAt, row.processedAt),
    });
  }
}
