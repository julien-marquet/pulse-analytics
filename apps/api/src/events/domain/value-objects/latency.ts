export class Latency {
  readonly ingestionLatencyMs: number;
  readonly processingLatencyMs: number;
  readonly totalLatencyMs: number;

  constructor(emittedAt: Date, receivedAt: Date, processedAt: Date) {
    this.ingestionLatencyMs = receivedAt.valueOf() - emittedAt.valueOf();
    this.processingLatencyMs = processedAt.valueOf() - receivedAt.valueOf();
    this.totalLatencyMs = this.ingestionLatencyMs + this.processingLatencyMs;
  }
}
