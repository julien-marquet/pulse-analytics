import { makeDailyStatDbEntry } from '../../db.fixtures';
import {
  BuildStatsOverview,
  GetTopEventTypes,
  SumAverageProcessingLatency,
} from './event-stats.helper';

describe('EventStatsHelpers', () => {
  describe('BuildStatsOverview', () => {
    it('Should return empty entries stats', () => {
      expect(BuildStatsOverview([], undefined, 1)).toEqual({
        averageProcessingLatencyMs: null,
        eventTypesCount: 0,
        latestEventAt: undefined,
        topEventTypes: [],
        totalEvents: 0,
      });
    });
    it('Should returnstats with latestEventAt', () => {
      expect(
        BuildStatsOverview(
          [
            makeDailyStatDbEntry({
              count: 2,
              eventType: '1',
              processingLatencyTotalMs: 20,
            }),
            makeDailyStatDbEntry({
              count: 2,
              eventType: '1',
              processingLatencyTotalMs: 40,
            }),
          ],
          new Date('2026-04-01T00:00:00.000Z'),
          3,
        ),
      ).toEqual({
        averageProcessingLatencyMs: 15,
        eventTypesCount: 1,
        latestEventAt: '2026-04-01T00:00:00.000Z',
        topEventTypes: [{ count: 4, eventType: '1' }],
        totalEvents: 4,
      });
    });
    it('Should returnstats without latestEventAt', () => {
      expect(
        BuildStatsOverview(
          [
            makeDailyStatDbEntry({
              count: 2,
              eventType: '2',
              processingLatencyTotalMs: 20,
            }),
            makeDailyStatDbEntry({
              count: 4,
              eventType: '1',
              processingLatencyTotalMs: 40,
            }),
          ],
          undefined,
          3,
        ),
      ).toEqual({
        averageProcessingLatencyMs: 10,
        eventTypesCount: 2,
        latestEventAt: undefined,
        topEventTypes: [
          { count: 4, eventType: '1' },
          { count: 2, eventType: '2' },
        ],
        totalEvents: 6,
      });
    });
  });
  describe('GetTopEventTypes', () => {
    it('Should return sorted array with distinct eventType', () => {
      expect(
        GetTopEventTypes(
          [
            makeDailyStatDbEntry({ eventType: '1', count: 2 }),
            makeDailyStatDbEntry({ eventType: '2', count: 3 }),
            makeDailyStatDbEntry({ eventType: '3', count: 1 }),
          ],
          2,
        ),
      ).toEqual([
        { eventType: '2', count: 3 },
        { eventType: '1', count: 2 },
      ]);
    });
    it('Should return sorted array with duplicated eventType', () => {
      expect(
        GetTopEventTypes(
          [
            makeDailyStatDbEntry({ eventType: '1', count: 2 }),
            makeDailyStatDbEntry({ eventType: '2', count: 1 }),
            makeDailyStatDbEntry({ eventType: '1', count: 5 }),
            makeDailyStatDbEntry({ eventType: '3', count: 7 }),
            makeDailyStatDbEntry({ eventType: '1', count: 3 }),
            makeDailyStatDbEntry({ eventType: '3', count: 11 }),
          ],
          3,
        ),
      ).toEqual([
        { eventType: '3', count: 18 },
        { eventType: '1', count: 10 },
        { eventType: '2', count: 1 },
      ]);
    });
    it('Should cut to selection size', () => {
      expect(
        GetTopEventTypes(
          [
            makeDailyStatDbEntry({ eventType: '1', count: 2 }),
            makeDailyStatDbEntry({ eventType: '2', count: 1 }),
            makeDailyStatDbEntry({ eventType: '1', count: 5 }),
            makeDailyStatDbEntry({ eventType: '4', count: 7 }),
            makeDailyStatDbEntry({ eventType: '1', count: 3 }),
            makeDailyStatDbEntry({ eventType: '3', count: 11 }),
          ],
          3,
        ),
      ).toEqual([
        { eventType: '3', count: 11 },
        { eventType: '1', count: 10 },
        { eventType: '4', count: 7 },
      ]);
    });
    it('Should return empty array on empty entry', () => {
      expect(GetTopEventTypes([], 3)).toEqual([]);
    });
    it('Should return empty array on selectionSize = 0', () => {
      expect(
        GetTopEventTypes(
          [makeDailyStatDbEntry({ eventType: '1', count: 2 })],
          0,
        ),
      ).toEqual([]);
    });
    it('Should return array of size < selectionSize', () => {
      expect(
        GetTopEventTypes(
          [
            makeDailyStatDbEntry({ eventType: '1', count: 2 }),
            makeDailyStatDbEntry({ eventType: '1', count: 3 }),
          ],
          3,
        ),
      ).toEqual([{ eventType: '1', count: 5 }]);
    });
  });
  describe('SumAverageProcessingLatency', () => {
    it('Should return NaN for empty array', () => {
      expect(SumAverageProcessingLatency([])).toBe(null);
    });
    it('Should return processingLatencyTotalMs for length 1 and count 1', () => {
      expect(
        SumAverageProcessingLatency([
          makeDailyStatDbEntry({ count: 1, processingLatencyTotalMs: 50 }),
        ]),
      ).toBe(50);
    });
    it('Should return processingLatencyTotalMs / count for length 1 and count > 1', () => {
      expect(
        SumAverageProcessingLatency([
          makeDailyStatDbEntry({ count: 5, processingLatencyTotalMs: 50 }),
        ]),
      ).toBe(10);
    });
    it('Should return average of array', () => {
      expect(
        SumAverageProcessingLatency([
          makeDailyStatDbEntry({ count: 3, processingLatencyTotalMs: 40 }),
          makeDailyStatDbEntry({ count: 2, processingLatencyTotalMs: 10 }),
        ]),
      ).toBe(10);
    });
  });
});
