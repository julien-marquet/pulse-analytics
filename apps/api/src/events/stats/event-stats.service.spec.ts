import { EventsStatsService } from './event-stats.service';
import {
  createPrismaServiceMock,
  PrismaServiceMock,
} from '../../prisma.service.mock';
import { DatePrismaConverter } from '@app/common';
import { DailyEventStat } from '@app/database';
import { makeDailyStatDbEntry, makeEventDbEntry } from '../../db.fixtures';

describe('EventStatsService', () => {
  let service: EventsStatsService;
  let prisma: PrismaServiceMock;

  beforeEach(() => {
    prisma = createPrismaServiceMock();
    service = new EventsStatsService(prisma);
  });

  describe('GetStatsByDay', () => {
    const from = '2026-03-01';
    const to = '2026-04-01';

    it('should return mapped results with count and date', async () => {
      prisma.dailyEventStat.groupBy.mockResolvedValue([
        {
          date: DatePrismaConverter.toPrisma('2026-03-01'),
          _sum: { count: 5 },
        },
        {
          date: DatePrismaConverter.toPrisma('2026-03-02'),
          _sum: { count: 10 },
        },
      ] as any);

      const res = await service.GetStatsByDay('UTC', from, to);

      expect(res).toEqual([
        { count: 5, date: '2026-03-01' },
        { count: 10, date: '2026-03-02' },
      ]);
    });

    it('should default count to 0 when _sum.count is null', async () => {
      prisma.dailyEventStat.groupBy.mockResolvedValue([
        {
          date: DatePrismaConverter.toPrisma('2026-03-01'),
          _sum: { count: null },
        },
      ] as any);

      const res = await service.GetStatsByDay('UTC', from, to);

      expect(res).toEqual([{ count: 0, date: '2026-03-01' }]);
    });

    it('should query prisma with the correct date range and timezone', async () => {
      prisma.dailyEventStat.groupBy.mockResolvedValue([]);

      await service.GetStatsByDay('UTC', from, to);

      expect(prisma.dailyEventStat.groupBy).toHaveBeenCalledWith(
        expect.objectContaining({
          by: 'date',
          where: {
            date: {
              gte: DatePrismaConverter.toPrisma(from),
              lte: DatePrismaConverter.toPrisma(to),
            },
            timeZone: 'UTC',
          },
          _sum: { count: true },
          orderBy: { date: 'asc' },
        }),
      );
    });

    it('should return an empty array when there are no results', async () => {
      prisma.dailyEventStat.groupBy.mockResolvedValue([]);

      const res = await service.GetStatsByDay('UTC', from, to);

      expect(res).toEqual([]);
    });
  });

  describe('GetStatsByType', () => {
    const from = '2026-03-01';
    const to = '2026-04-01';

    it('should return mapped results with total and types ordered by count desc', async () => {
      prisma.dailyEventStat.groupBy.mockResolvedValue([
        { eventType: 'page-viewed', _sum: { count: 20 } },
        { eventType: 'button-clicked', _sum: { count: 15 } },
      ] as any);

      const res = await service.GetStatsByType('UTC', from, to);

      expect(res).toEqual({
        total: 35,
        types: [
          { type: 'page-viewed', count: 20 },
          { type: 'button-clicked', count: 15 },
        ],
      });
    });

    it('should default count to 0 when _sum.count is null', async () => {
      prisma.dailyEventStat.groupBy.mockResolvedValue([
        { eventType: 'page-viewed', _sum: { count: null } },
      ] as any);

      const res = await service.GetStatsByType('UTC', from, to);

      expect(res).toEqual({
        total: 0,
        types: [{ type: 'page-viewed', count: 0 }],
      });
    });

    it('should return empty total and types when there are no results', async () => {
      prisma.dailyEventStat.groupBy.mockResolvedValue([]);

      const res = await service.GetStatsByType('UTC', from, to);

      expect(res).toEqual({ total: 0, types: [] });
    });

    it('should query prisma with the correct date range, timezone, and orderBy', async () => {
      prisma.dailyEventStat.groupBy.mockResolvedValue([]);

      await service.GetStatsByType('UTC', from, to);

      expect(prisma.dailyEventStat.groupBy).toHaveBeenCalledWith(
        expect.objectContaining({
          by: 'eventType',
          where: {
            date: {
              gte: DatePrismaConverter.toPrisma(from),
              lte: DatePrismaConverter.toPrisma(to),
            },
            timeZone: 'UTC',
          },
          _sum: { count: true },
          orderBy: { _sum: { count: 'desc' } },
        }),
      );
    });
  });
  describe('GetStatsOverview', () => {
    const from = '2026-03-01';
    const to = '2026-04-01';

    it('should compute all aggregate fields correctly', async () => {
      prisma.event.findFirst.mockResolvedValue(
        makeEventDbEntry({ emittedAt: new Date('2026-04-01T12:00:00.000Z') }),
      );

      prisma.dailyEventStat.findMany.mockResolvedValue([
        makeDailyStatDbEntry({
          eventType: 'button-clicked',
          count: 10,
          processingLatencyTotalMs: 1000,
        }),
        makeDailyStatDbEntry({
          eventType: 'button-clicked',
          count: 5,
          processingLatencyTotalMs: 500,
        }),
        makeDailyStatDbEntry({
          eventType: 'page-viewed',
          count: 20,
          processingLatencyTotalMs: 2000,
        }),
      ]);

      const res = await service.GetStatsOverview('UTC', from, to, 3);

      expect(res.totalEvents).toBe(35); // 10+5+20
      expect(res.averageProcessingLatencyMs).toBe(100); // 3500/35
      expect(res.eventTypesCount).toBe(2); // button-clicked + page-viewed
      expect(res.topEventTypes).toEqual([
        { eventType: 'page-viewed', count: 20 },
        { eventType: 'button-clicked', count: 15 },
      ]);
      expect(res.latestEventAt).toBe('2026-04-01T12:00:00.000Z');
    });

    it('should set latestEventAt to undefined when no event exists', async () => {
      prisma.event.findFirst.mockResolvedValue(null);
      prisma.dailyEventStat.findMany.mockResolvedValue([]);

      const res = await service.GetStatsOverview('UTC', from, to, 3);

      expect(res.latestEventAt).toBeUndefined();
    });

    it('should query prisma with the correct date range', async () => {
      prisma.event.findFirst.mockResolvedValue(null);
      prisma.dailyEventStat.findMany.mockResolvedValue([]);

      await service.GetStatsOverview('UTC', from, to, 3);

      const expectedRange = {
        gte: DatePrismaConverter.toPrisma(from),
        lte: DatePrismaConverter.toPrisma(to),
      };
      expect(prisma.dailyEventStat.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { date: expectedRange, timeZone: 'UTC' },
        }),
      );
      expect(prisma.event.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { emittedAt: expectedRange },
        }),
      );
    });
  });
});
