import { DatePrismaConverter } from '@app/common';
import { Event } from '@app/events-domain';
import {
  createPrismaServiceMock,
  PrismaServiceMock,
} from '../../prisma.service.mock';
import { makeEventDbEntry } from '../../db.fixtures';
import { EventPrismaRepository } from './event.prisma.reader';

describe('EventPrismaRepository', () => {
  let repo: EventPrismaRepository;
  let prisma: PrismaServiceMock;

  beforeEach(() => {
    prisma = createPrismaServiceMock();
    repo = new EventPrismaRepository(prisma);
  });

  // describe('save', () => {
  //   const event = Event.create({
  //     id: 'evt-1',
  //     type: 'page-viewed',
  //     emittedAt: new Date('2026-01-01T00:00:00.000Z'),
  //     receivedAt: new Date('2026-01-01T00:00:00.100Z'),
  //     processedAt: new Date('2026-01-01T00:00:00.150Z'),
  //     properties: { page: '/home' },
  //   });

  //   it('should call prisma.event.create with all event fields', async () => {
  //     await repo.save(event);

  //     expect(prisma.event.create).toHaveBeenCalledWith({
  //       data: {
  //         id: event.id,
  //         type: event.type,
  //         emittedAt: event.emittedAt,
  //         receivedAt: event.receivedAt,
  //         processedAt: event.processedAt,
  //         properties: event.properties,
  //       },
  //     });
  //   });

  //   it('should call prisma.event.create exactly once', async () => {
  //     await repo.save(event);

  //     expect(prisma.event.create).toHaveBeenCalledTimes(1);
  //   });
  // });

  describe('getTypes', () => {
    it('should return distinct event types', async () => {
      prisma.event.findMany.mockResolvedValue([
        { type: 'page-viewed' },
        { type: 'button-clicked' },
      ] as any);

      const result = await repo.getTypes();

      expect(result).toEqual(['page-viewed', 'button-clicked']);
      expect(prisma.event.findMany).toHaveBeenCalledWith({
        select: { type: true },
        distinct: 'type',
      });
    });

    it('should return an empty array when no events exist', async () => {
      prisma.event.findMany.mockResolvedValue([]);

      expect(await repo.getTypes()).toEqual([]);
    });
  });

  describe('findMany', () => {
    it('should apply correct pagination skip and take', async () => {
      prisma.event.findMany.mockResolvedValue([]);
      prisma.event.count.mockResolvedValue(0);

      await repo.findMany({ page: 3, pageSize: 10 });

      expect(prisma.event.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 20, take: 10 }),
      );
    });

    it('should map all db fields to the domain object', async () => {
      const dbEvent = makeEventDbEntry({
        id: 'evt-1',
        type: 'click',
        emittedAt: new Date('2026-01-01T00:00:00.000Z'),
        receivedAt: new Date('2026-01-01T00:00:00.100Z'),
        processedAt: new Date('2026-01-01T00:00:00.150Z'),
        properties: { key: 'value' },
      });
      prisma.event.findMany.mockResolvedValue([dbEvent]);
      prisma.event.count.mockResolvedValue(1);

      const { data } = await repo.findMany({ page: 1, pageSize: 10 });

      expect(data[0].id).toBe('evt-1');
      expect(data[0].type).toBe('click');
      expect(data[0].emittedAt).toEqual(new Date('2026-01-01T00:00:00.000Z'));
      expect(data[0].receivedAt).toEqual(new Date('2026-01-01T00:00:00.100Z'));
      expect(data[0].processedAt).toEqual(new Date('2026-01-01T00:00:00.150Z'));
      expect(data[0].properties).toEqual({ key: 'value' });
      expect(data[0].latencies).toEqual({
        ingestionLatencyMs: 100,
        processingLatencyMs: 50,
        totalLatencyMs: 150,
      });
    });

    it('should filter by event types when provided', async () => {
      prisma.event.findMany.mockResolvedValue([]);
      prisma.event.count.mockResolvedValue(0);

      await repo.findMany({ page: 1, pageSize: 10, type: ['PAGE_VIEWED'] });

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

      await repo.findMany({ page: 1, pageSize: 10 });

      expect(prisma.event.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ type: undefined }),
        }),
      );
    });

    it('should omit type filter when an empty array is provided', async () => {
      prisma.event.findMany.mockResolvedValue([]);
      prisma.event.count.mockResolvedValue(0);

      await repo.findMany({ page: 1, pageSize: 10, type: [] });

      expect(prisma.event.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ type: undefined }),
        }),
      );
    });

    it('should apply date range filter when from and to are provided', async () => {
      const from = new Date('2026-01-01T00:00:00.000Z');
      const to = new Date('2026-01-31T23:59:59.999Z');
      prisma.event.findMany.mockResolvedValue([]);
      prisma.event.count.mockResolvedValue(0);

      await repo.findMany({ page: 1, pageSize: 10, from, to });

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
      prisma.event.findMany.mockResolvedValue([]);
      prisma.event.count.mockResolvedValue(0);

      await repo.findMany({ page: 1, pageSize: 10, type: ['CLICK'] });

      const findManyWhere = prisma.event.findMany.mock.calls[0][0]?.where;
      const countWhere = prisma.event.count.mock.calls[0][0]?.where;
      expect(findManyWhere).toEqual(countWhere);
    });

    it('should sort by emittedAt desc by default', async () => {
      prisma.event.findMany.mockResolvedValue([]);
      prisma.event.count.mockResolvedValue(0);

      await repo.findMany({ page: 1, pageSize: 10 });

      expect(prisma.event.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { emittedAt: 'desc' } }),
      );
    });

    it('should sort by type when sortBy is type', async () => {
      prisma.event.findMany.mockResolvedValue([]);
      prisma.event.count.mockResolvedValue(0);

      await repo.findMany({ page: 1, pageSize: 10, sortBy: 'type' });

      expect(prisma.event.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { type: 'desc' } }),
      );
    });

    it('should sort asc when sortAsc is true', async () => {
      prisma.event.findMany.mockResolvedValue([]);
      prisma.event.count.mockResolvedValue(0);

      await repo.findMany({
        page: 1,
        pageSize: 10,
        sortBy: 'emittedAt',
        sortAsc: true,
      });

      expect(prisma.event.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { emittedAt: 'asc' } }),
      );
    });

    it('should return empty data and zero total when no events are found', async () => {
      prisma.event.findMany.mockResolvedValue([]);
      prisma.event.count.mockResolvedValue(0);

      expect(await repo.findMany({ page: 1, pageSize: 10 })).toEqual({
        data: [],
        total: 0,
      });
    });
  });

  describe('findLatestEmittedAt', () => {
    it('should return the emittedAt of the latest event', async () => {
      const emittedAt = new Date('2026-04-01T12:00:00.000Z');
      prisma.event.findFirst.mockResolvedValue(makeEventDbEntry({ emittedAt }));

      expect(
        await repo.findLatestEmittedAt('2026-03-01', '2026-04-01'),
      ).toEqual(emittedAt);
    });

    it('should return null when no event is found', async () => {
      prisma.event.findFirst.mockResolvedValue(null);

      expect(
        await repo.findLatestEmittedAt('2026-03-01', '2026-04-01'),
      ).toBeNull();
    });

    it('should query with the correct date range', async () => {
      prisma.event.findFirst.mockResolvedValue(null);
      const from = '2026-03-01';
      const to = '2026-04-01';

      await repo.findLatestEmittedAt(from, to);

      expect(prisma.event.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { emittedAt: 'desc' },
          where: {
            emittedAt: {
              gte: DatePrismaConverter.toPrisma(from),
              lte: DatePrismaConverter.toPrisma(to),
            },
          },
        }),
      );
    });

    it('should omit date bounds when not provided', async () => {
      prisma.event.findFirst.mockResolvedValue(null);

      await repo.findLatestEmittedAt();

      expect(prisma.event.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { emittedAt: { gte: undefined, lte: undefined } },
        }),
      );
    });
  });
});
