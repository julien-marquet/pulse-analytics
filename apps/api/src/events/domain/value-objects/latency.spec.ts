import { Latency } from './latency';

describe('Latency', () => {
  it('should calculate ingestion, processing, and total latency correctly', () => {
    const latency = new Latency(
      new Date('2026-01-01T00:00:00.000Z'),
      new Date('2026-01-01T00:00:00.200Z'),
      new Date('2026-01-01T00:00:00.350Z'),
    );

    expect(latency.ingestionLatencyMs).toBe(200);
    expect(latency.processingLatencyMs).toBe(150);
    expect(latency.totalLatencyMs).toBe(350);
  });

  it('should return zero latencies when all timestamps are equal', () => {
    const ts = new Date('2026-01-01T00:00:00.000Z');
    const latency = new Latency(ts, ts, ts);

    expect(latency.ingestionLatencyMs).toBe(0);
    expect(latency.processingLatencyMs).toBe(0);
    expect(latency.totalLatencyMs).toBe(0);
  });

  it('should return negative latencies when timestamps are out of order', () => {
    const latency = new Latency(
      new Date('2026-01-01T00:00:00.500Z'),
      new Date('2026-01-01T00:00:00.000Z'),
      new Date('2026-01-01T00:00:00.300Z'),
    );

    expect(latency.ingestionLatencyMs).toBe(-500);
    expect(latency.processingLatencyMs).toBe(300);
    expect(latency.totalLatencyMs).toBe(-200);
  });
});
