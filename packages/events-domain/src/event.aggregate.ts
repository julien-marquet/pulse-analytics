import { EventCandidate } from './event-candidate.entity';
import { Latency } from './value-objects/latency';
import { Timing } from './value-objects/timing';

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

  static create(data: {
    id: string;
    type: string;
    emittedAt: Date;
    receivedAt: Date;
    processedAt: Date;
    properties: Record<string, unknown>;
  }): Event {
    const timing = Timing.create(
      data.emittedAt,
      data.receivedAt,
      data.processedAt,
    );
    return new Event({ ...data, latencies: new Latency(timing) });
  }

  static fromCandidate(candidate: EventCandidate, timing: Timing): Event {
    return new Event({
      id: candidate.id,
      type: candidate.type,
      properties: candidate.properties,
      emittedAt: timing.emittedAt,
      receivedAt: timing.receivedAt,
      processedAt: timing.processedAt,
      latencies: new Latency(timing),
    });
  }
}
