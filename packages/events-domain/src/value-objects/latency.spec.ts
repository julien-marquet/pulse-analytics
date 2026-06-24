import { Latency } from './latency';
import { Timing } from './timing';

describe('Latency', () => {
  it('should calculate ingestion, processing, and total latency correctly', () => {
    const timing = Timing.create(
      new Date('2026-01-01T00:00:00.000Z'),
      new Date('2026-01-01T00:00:00.200Z'),
      new Date('2026-01-01T00:00:00.350Z'),
    );
    const latency = new Latency(timing);

    expect(latency.ingestionLatencyMs).toBe(200);
    expect(latency.processingLatencyMs).toBe(150);
    expect(latency.totalLatencyMs).toBe(350);
  });

  it('should return zero latencies when all timestamps are equal', () => {
    const ts = new Date('2026-01-01T00:00:00.000Z');
    const timing = Timing.create(ts, ts, ts);
    const latency = new Latency(timing);

    expect(latency.ingestionLatencyMs).toBe(0);
    expect(latency.processingLatencyMs).toBe(0);
    expect(latency.totalLatencyMs).toBe(0);
  });
});
