import { makeEventDbEntry } from '../../db.fixtures';
import {
  createPrismaServiceMock,
  PrismaServiceMock,
} from '../../prisma.service.mock';
import { EventsQueryService } from './event-query.service';

describe('EventQueryService', () => {
  let service: EventsQueryService;
  let prisma: PrismaServiceMock;

  beforeEach(() => {
    prisma = createPrismaServiceMock();
    service = new EventsQueryService(prisma);
  });

  describe('getEvents', () => {
    it('should return paginated data with latencies and total count', async () => {
      const dbEvents = [
        makeEventDbEntry({
          id: '1',
          emittedAt: new Date('2026-01-01T00:00:00.000Z'),
          receivedAt: new Date('2026-01-01T00:00:00.100Z'),
          processedAt: new Date('2026-01-01T00:00:00.150Z'),
        }),
        makeEventDbEntry({ id: '2' }),
      ];
      prisma.event.findMany.mockResolvedValue(dbEvents);
      prisma.event.count.mockResolvedValue(2);

      const result = await service.getEvents(1, 10);

      expect(result.total).toBe(2);
      expect(result.data).toHaveLength(2);
      expect(result.data[0]).toHaveProperty('latencies');
      expect(result.data[0].latencies).toEqual({
        ingestionLatencyMs: 100,
        processingLatencyMs: 50,
        totalLatencyMs: 150,
      });
    });

    it('should apply correct pagination skip and take', async () => {
      prisma.event.findMany.mockResolvedValue([]);
      prisma.event.count.mockResolvedValue(0);

      await service.getEvents(3, 10);

      expect(prisma.event.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 20, take: 10 }),
      );
    });

    it('should filter by event types when provided', async () => {
      prisma.event.findMany.mockResolvedValue([]);
      prisma.event.count.mockResolvedValue(0);

      await service.getEvents(1, 10, ['PAGE_VIEWED']);

      const expectedWhere = expect.objectContaining({
        type: { in: ['PAGE_VIEWED'] },
      });
      expect(prisma.event.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expectedWhere }),
      );
      expect(prisma.event.count).toHaveBeenCalledWith(
        expect.objectContaining({ where: expectedWhere }),
      );
    });

    it('should omit type filter when no types are provided', async () => {
      prisma.event.findMany.mockResolvedValue([]);
      prisma.event.count.mockResolvedValue(0);

      await service.getEvents(1, 10);

      const expectedWhere = expect.objectContaining({ type: undefined });
      expect(prisma.event.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expectedWhere }),
      );
    });

    it('should omit type filter when an empty types array is provided', async () => {
      prisma.event.findMany.mockResolvedValue([]);
      prisma.event.count.mockResolvedValue(0);

      await service.getEvents(1, 10, []);

      const expectedWhere = expect.objectContaining({ type: undefined });
      expect(prisma.event.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expectedWhere }),
      );
    });

    it('should apply date range filters when from and to are provided', async () => {
      const from = new Date('2026-01-01T00:00:00.000Z');
      const to = new Date('2026-01-31T23:59:59.999Z');
      prisma.event.findMany.mockResolvedValue([]);
      prisma.event.count.mockResolvedValue(0);

      await service.getEvents(1, 10, undefined, from, to);

      const expectedWhere = expect.objectContaining({
        emittedAt: { gte: from, lte: to },
      });
      expect(prisma.event.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expectedWhere }),
      );
      expect(prisma.event.count).toHaveBeenCalledWith(
        expect.objectContaining({ where: expectedWhere }),
      );
    });

    it('should use the same filters for both findMany and count', async () => {
      const from = new Date('2026-01-01T00:00:00.000Z');
      prisma.event.findMany.mockResolvedValue([]);
      prisma.event.count.mockResolvedValue(0);

      await service.getEvents(1, 10, ['BUTTON_CLICKED'], from);

      const findManyWhere = prisma.event.findMany.mock.calls[0][0]?.where;
      const countWhere = prisma.event.count.mock.calls[0][0]?.where;
      expect(findManyWhere).toEqual(countWhere);
    });

    it('should return an empty data array when no events are found', async () => {
      prisma.event.findMany.mockResolvedValue([]);
      prisma.event.count.mockResolvedValue(0);

      const result = await service.getEvents(1, 10);

      expect(result).toEqual({ data: [], total: 0 });
    });
    it('should sort by emittedAt desc by default', async () => {
      prisma.event.findMany.mockResolvedValue([]);
      prisma.event.count.mockResolvedValue(0);

      await service.getEvents(1, 10);

      expect(prisma.event.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { emittedAt: 'desc' },
        }),
      );
    });

    it('should sort by type when asked', async () => {
      prisma.event.findMany.mockResolvedValue([]);
      prisma.event.count.mockResolvedValue(0);

      await service.getEvents(1, 10, undefined, undefined, undefined, 'type');

      expect(prisma.event.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { type: 'desc' },
        }),
      );
    });

    it('should sort asc when asked', async () => {
      prisma.event.findMany.mockResolvedValue([]);
      prisma.event.count.mockResolvedValue(0);

      await service.getEvents(
        1,
        10,
        undefined,
        undefined,
        undefined,
        'emittedAt',
        true,
      );

      expect(prisma.event.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { emittedAt: 'asc' },
        }),
      );
    });
  });
});
