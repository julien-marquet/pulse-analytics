import { Timing } from './timing';

export class Latency {
  readonly ingestionLatencyMs: number;
  readonly processingLatencyMs: number;
  readonly totalLatencyMs: number;

  constructor(timing: Timing) {
    this.ingestionLatencyMs =
      timing.receivedAt.valueOf() - timing.emittedAt.valueOf();
    this.processingLatencyMs =
      timing.processedAt.valueOf() - timing.receivedAt.valueOf();
    this.totalLatencyMs = this.ingestionLatencyMs + this.processingLatencyMs;
  }
}
