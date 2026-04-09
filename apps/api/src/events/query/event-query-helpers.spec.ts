import { makeEventDbEntry } from '../../db.fixtures';
import { addLatenciesToDbEvents } from './event-query-helpers';

describe('EventQueryHelpers', () => {
  describe('addLatenciesToDbEvents', () => {
    it('should return an empty array when given an empty array', () => {
      expect(addLatenciesToDbEvents([])).toEqual([]);
    });

    it('should calculate ingestion, processing, and total latency correctly', () => {
      const event = makeEventDbEntry({
        emittedAt: new Date('2026-01-01T00:00:00.000Z'),
        receivedAt: new Date('2026-01-01T00:00:00.200Z'),
        processedAt: new Date('2026-01-01T00:00:00.350Z'),
      });

      const [result] = addLatenciesToDbEvents([event]);

      expect(result.latencies).toEqual({
        ingestionLatencyMs: 200,
        processingLatencyMs: 150,
        totalLatencyMs: 350,
      });
    });

    it('should preserve all original event fields on each result', () => {
      const event = makeEventDbEntry({
        id: 'abc',
        type: 'click',
        properties: { page: '/home' },
      });

      const [result] = addLatenciesToDbEvents([event]);

      expect(result.id).toBe('abc');
      expect(result.type).toBe('click');
      expect(result.properties).toEqual({ page: '/home' });
      expect(result.emittedAt).toEqual(event.emittedAt);
      expect(result.receivedAt).toEqual(event.receivedAt);
      expect(result.processedAt).toEqual(event.processedAt);
    });

    it('should process multiple events independently', () => {
      const event1 = makeEventDbEntry({
        id: '1',
        emittedAt: new Date('2026-01-01T00:00:00.000Z'),
        receivedAt: new Date('2026-01-01T00:00:00.100Z'),
        processedAt: new Date('2026-01-01T00:00:00.200Z'),
      });
      const event2 = makeEventDbEntry({
        id: '2',
        emittedAt: new Date('2026-01-01T00:00:01.000Z'),
        receivedAt: new Date('2026-01-01T00:00:01.500Z'),
        processedAt: new Date('2026-01-01T00:00:01.600Z'),
      });

      const results = addLatenciesToDbEvents([event1, event2]);

      expect(results).toHaveLength(2);
      expect(results[0].latencies).toEqual({
        ingestionLatencyMs: 100,
        processingLatencyMs: 100,
        totalLatencyMs: 200,
      });
      expect(results[1].latencies).toEqual({
        ingestionLatencyMs: 500,
        processingLatencyMs: 100,
        totalLatencyMs: 600,
      });
    });

    it('should return zero latencies when all timestamps are equal', () => {
      const ts = new Date('2026-01-01T00:00:00.000Z');
      const event = makeEventDbEntry({
        emittedAt: ts,
        receivedAt: ts,
        processedAt: ts,
      });

      const [result] = addLatenciesToDbEvents([event]);

      expect(result.latencies).toEqual({
        ingestionLatencyMs: 0,
        processingLatencyMs: 0,
        totalLatencyMs: 0,
      });
    });

    it('should return negative latencies when timestamps are out of order', () => {
      const event = makeEventDbEntry({
        emittedAt: new Date('2026-01-01T00:00:00.500Z'),
        receivedAt: new Date('2026-01-01T00:00:00.000Z'),
        processedAt: new Date('2026-01-01T00:00:00.300Z'),
      });

      const [result] = addLatenciesToDbEvents([event]);

      expect(result.latencies.ingestionLatencyMs).toBe(-500);
      expect(result.latencies.processingLatencyMs).toBe(300);
      expect(result.latencies.totalLatencyMs).toBe(-200);
    });

    it('should not mutate the original input array', () => {
      const event = makeEventDbEntry();
      const input = [event];

      addLatenciesToDbEvents(input);

      expect(input[0]).not.toHaveProperty('latencies');
    });
  });
});
