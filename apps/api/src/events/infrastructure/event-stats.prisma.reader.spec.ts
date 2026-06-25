import { DatePrismaConverter } from '@app/common';
import {
  createPrismaServiceMock,
  PrismaServiceMock,
} from '../../prisma.service.mock';
import { EventStatsPrismaReader } from './event-stats.prisma.reader';

describe('EventStatsPrismaReader', () => {
  let repo: EventStatsPrismaReader;
  let prisma: PrismaServiceMock;

  const query = { timeZone: 'UTC', from: '2026-03-01', to: '2026-04-01' };

  beforeEach(() => {
    prisma = createPrismaServiceMock();
    repo = new EventStatsPrismaReader(prisma);
  });

  describe('groupByDay', () => {
    it('should query prisma with the correct date range, timezone and ordering', async () => {
      prisma.dailyEventStat.groupBy.mockResolvedValue([]);

      await repo.groupByDay(query);

      expect(prisma.dailyEventStat.groupBy).toHaveBeenCalledWith(
        expect.objectContaining({
          by: 'date',
          where: {
            date: {
              gte: DatePrismaConverter.toPrisma(query.from),
              lte: DatePrismaConverter.toPrisma(query.to),
            },
            timeZone: 'UTC',
          },
          _sum: { count: true, processingLatencyTotalMs: true },
          orderBy: { date: 'asc' },
        }),
      );
    });

    it('should return mapped results with count, date and averageLatencyMs', async () => {
      prisma.dailyEventStat.groupBy.mockResolvedValue([
        {
          date: DatePrismaConverter.toPrisma('2026-03-01'),
          _sum: { count: 5, processingLatencyTotalMs: 10 },
        },
        {
          date: DatePrismaConverter.toPrisma('2026-03-02'),
          _sum: { count: 10, processingLatencyTotalMs: 5 },
        },
      ] as any);

      const result = await repo.groupByDay(query);

      expect(result).toEqual([
        { count: 5, date: '2026-03-01', averageLatencyMs: 2 },
        { count: 10, date: '2026-03-02', averageLatencyMs: 0.5 },
      ]);
    });

    it('should default count and averageLatencyMs to 0 when sums are null', async () => {
      prisma.dailyEventStat.groupBy.mockResolvedValue([
        {
          date: DatePrismaConverter.toPrisma('2026-03-01'),
          _sum: { count: null, processingLatencyTotalMs: null },
        },
      ] as any);

      const result = await repo.groupByDay(query);

      expect(result).toEqual([
        { count: 0, date: '2026-03-01', averageLatencyMs: 0 },
      ]);
    });

    it('should return an empty array when there are no results', async () => {
      prisma.dailyEventStat.groupBy.mockResolvedValue([]);

      expect(await repo.groupByDay(query)).toEqual([]);
    });
  });

  describe('groupByType', () => {
    it('should query prisma with the correct date range, timezone and ordering', async () => {
      prisma.dailyEventStat.groupBy.mockResolvedValue([]);

      await repo.groupByType(query);

      expect(prisma.dailyEventStat.groupBy).toHaveBeenCalledWith(
        expect.objectContaining({
          by: 'eventType',
          where: {
            date: {
              gte: DatePrismaConverter.toPrisma(query.from),
              lte: DatePrismaConverter.toPrisma(query.to),
            },
            timeZone: 'UTC',
          },
          _sum: { count: true, processingLatencyTotalMs: true },
          orderBy: { _sum: { count: 'desc' } },
        }),
      );
    });

    it('should return mapped results with eventType, count and processingLatencyTotalMs', async () => {
      prisma.dailyEventStat.groupBy.mockResolvedValue([
        {
          eventType: 'page-viewed',
          _sum: { count: 20, processingLatencyTotalMs: 2000 },
        },
        {
          eventType: 'button-clicked',
          _sum: { count: 15, processingLatencyTotalMs: 1500 },
        },
      ] as any);

      const result = await repo.groupByType(query);

      expect(result).toEqual([
        { eventType: 'page-viewed', count: 20, processingLatencyTotalMs: 2000 },
        {
          eventType: 'button-clicked',
          count: 15,
          processingLatencyTotalMs: 1500,
        },
      ]);
    });

    it('should default count and processingLatencyTotalMs to 0 when sums are null', async () => {
      prisma.dailyEventStat.groupBy.mockResolvedValue([
        {
          eventType: 'page-viewed',
          _sum: { count: null, processingLatencyTotalMs: null },
        },
      ] as any);

      const result = await repo.groupByType(query);

      expect(result).toEqual([
        { eventType: 'page-viewed', count: 0, processingLatencyTotalMs: 0 },
      ]);
    });

    it('should return an empty array when there are no results', async () => {
      prisma.dailyEventStat.groupBy.mockResolvedValue([]);

      expect(await repo.groupByType(query)).toEqual([]);
    });
  });
});
