import { EventCandidate } from './event-candidate.entity';
import { Latency } from './value-objects/latency';
import { Timing } from './value-objects/timing';

export class Event {
  readonly id: string;
  readonly type: string;
  readonly properties: Record<string, unknown>;
  readonly timing: Timing;
  readonly latencies: Latency;

  private constructor(data: {
    id: string;
    type: string;
    properties: Record<string, unknown>;
    timing: Timing;
    latencies: Latency;
  }) {
    this.id = data.id;
    this.type = data.type;
    this.timing = data.timing;
    this.properties = data.properties;
    this.latencies = data.latencies;
  }

  static create(data: {
    id: string;
    type: string;
    timing: Timing;
    properties: Record<string, unknown>;
  }): Event {
    return new Event({ ...data, latencies: new Latency(data.timing) });
  }

  static fromCandidate(
    id: string,
    candidate: EventCandidate,
    receivedAt: Date,
    processedAt: Date,
  ): Event {
    const timing = Timing.create(candidate.emittedAt, receivedAt, processedAt);
    return new Event({
      id: id,
      type: candidate.type,
      properties: candidate.properties,
      timing,
      latencies: new Latency(timing),
    });
  }
}
