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
    it('should return mapped entries for the given date and timezone', async () => {
      prisma.dailyEventStat.findMany.mockResolvedValue([
        makeDailyStatDbEntry({ eventType: 'button-clicked', count: 3 }),
        makeDailyStatDbEntry({ eventType: 'page-viewed', count: 7 }),
      ]);

      const res = await service.GetStatsByDay('2026-04-01', 'UTC');

      expect(prisma.dailyEventStat.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            date: { equals: DatePrismaConverter.toPrisma('2026-04-01') },
            timeZone: 'UTC',
          },
          orderBy: { eventType: 'asc' },
        }),
      );
      expect(res).toEqual([
        { count: 3, eventType: 'button-clicked' },
        { count: 7, eventType: 'page-viewed' },
      ]);
    });

    it('should return an empty array when there are no stats', async () => {
      prisma.dailyEventStat.findMany.mockResolvedValue([]);
      const res = await service.GetStatsByDay('2026-04-01', 'UTC');
      expect(res).toEqual([]);
    });
  });

  describe('GetStatsByType', () => {
    it('should get stats by type with no date limit', async () => {
      prisma.dailyEventStat.findMany.mockResolvedValue([
        {
          count: 1,
          date: DatePrismaConverter.toPrisma('2026-04-01'),
        } as DailyEventStat,
      ]);

      const res = await service.GetStatsByType('button-clicked', 'UTC');

      expect(prisma.dailyEventStat.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            eventType: 'button-clicked',
            timeZone: 'UTC',
          }),
          orderBy: { date: 'desc' },
        }),
      );
      expect(res).toEqual([{ count: 1, date: '2026-04-01' }]);
    });

    it('should get stats by type with only a from bound', async () => {
      prisma.dailyEventStat.findMany.mockResolvedValue([]);

      await service.GetStatsByType('button-clicked', 'UTC', '2020-01-01');

      expect(prisma.dailyEventStat.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            date: {
              gte: DatePrismaConverter.toPrisma('2020-01-01'),
              lte: undefined,
            },
          }),
        }),
      );
    });

    it('should get stats by type with only a to bound', async () => {
      prisma.dailyEventStat.findMany.mockResolvedValue([]);

      await service.GetStatsByType(
        'button-clicked',
        'UTC',
        undefined,
        '2020-12-31',
      );

      expect(prisma.dailyEventStat.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            date: {
              gte: undefined,
              lte: DatePrismaConverter.toPrisma('2020-12-31'),
            },
          }),
        }),
      );
    });

    it('should get stats by type and date limit', async () => {
      prisma.dailyEventStat.findMany.mockResolvedValue([
        {
          count: 1,
          date: DatePrismaConverter.toPrisma('2020-12-31'),
        } as DailyEventStat,
      ]);

      const res = await service.GetStatsByType(
        'button-clicked',
        'UTC',
        '2020-12-31',
        '2021-01-01',
      );

      expect(prisma.dailyEventStat.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            eventType: 'button-clicked',
            timeZone: 'UTC',
            date: {
              gte: DatePrismaConverter.toPrisma('2020-12-31'),
              lte: DatePrismaConverter.toPrisma('2021-01-01'),
            },
          }),
          orderBy: { date: 'desc' },
        }),
      );
      expect(res).toEqual([
        {
          count: 1,
          date: '2020-12-31',
        },
      ]);
    });
  });
  describe('GetStatsOverview', () => {
    const from = '2026-03-01';
    const to = '2026-04-01';

    it('should compute all aggregate fields correctly', async () => {
      prisma.event.findFirst.mockResolvedValue(
        makeEventDbEntry({ emittedAt: new Date('2026-04-01T12:00:00Z') }),
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

      const res = await service.GetStatsOverview('UTC', from, to);

      expect(res.totalEvents).toBe(35); // 10+5+20
      expect(res.averageProcessingLatencyMs).toBe(100); // 3500/35
      expect(res.eventTypesCount).toBe(2); // button-clicked + page-viewed
      expect(res.topEventTypes).toEqual([
        { eventType: 'page-viewed', count: 20 },
        { eventType: 'button-clicked', count: 15 },
      ]);
      expect(res.latestEventAt).toBe('2026-04-01T12:00:00.000Z');
    });

    it('should return NaN for averageProcessingLatencyMs when there are no stats', async () => {
      prisma.event.findFirst.mockResolvedValue(null);
      prisma.dailyEventStat.findMany.mockResolvedValue([]);
      const res = await service.GetStatsOverview('UTC', from, to);
      expect(res.averageProcessingLatencyMs).toBeNaN();
    });

    it('should set latestEventAt to undefined when no event exists', async () => {
      prisma.event.findFirst.mockResolvedValue(null);
      prisma.dailyEventStat.findMany.mockResolvedValue([]);

      const res = await service.GetStatsOverview('UTC', from, to);

      expect(res.latestEventAt).toBeUndefined();
    });

    it('should query prisma with the correct date range', async () => {
      prisma.event.findFirst.mockResolvedValue(null);
      prisma.dailyEventStat.findMany.mockResolvedValue([]);

      await service.GetStatsOverview('UTC', from, to);

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
