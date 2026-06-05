import { makeEventData } from '@app/contracts/src/event.fixtures';
import { TypedConfigService } from '@app/common';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@app/database';
import { EventPersistenceService } from './event-persistence.service';
import { ConfigVariables } from './config';

type PrismaServiceMock = DeepMockProxy<PrismaClient>;
type ConfigServiceMock = DeepMockProxy<TypedConfigService<ConfigVariables>>;

describe('EventPersistenceService', () => {
  let service: EventPersistenceService;
  let prisma: PrismaServiceMock;
  let config: ConfigServiceMock;

  const timezones = ['UTC', 'America/New_York'];

  beforeEach(() => {
    prisma = mockDeep<PrismaClient>();
    config = mockDeep<TypedConfigService<ConfigVariables>>();
    config.get.mockReturnValue(timezones);
    prisma.$transaction.mockResolvedValue([]);

    service = new EventPersistenceService(prisma, config);
  });

  describe('persistEvent', () => {
    it('should call $transaction', async () => {
      const eventData = makeEventData();

      await service.persistEvent(
        'event-id',
        eventData,
        new Date('2026-04-09T12:00:01.000Z'),
        new Date('2026-04-09T12:00:02.000Z'),
      );

      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    });

    it('should create one event record', async () => {
      const eventData = makeEventData();
      const receivedAt = new Date('2026-04-09T12:00:01.000Z');
      const processedAt = new Date('2026-04-09T12:00:02.000Z');

      await service.persistEvent(
        'event-id',
        eventData,
        receivedAt,
        processedAt,
      );

      expect(prisma.event.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          id: 'event-id',
          type: eventData.type,
          properties: eventData.properties,
          receivedAt,
          processedAt,
          emittedAt: new Date(eventData.emittedAt),
        }),
      });
    });

    it('should upsert one dailyEventStat per timezone', async () => {
      const eventData = makeEventData();

      await service.persistEvent(
        'event-id',
        eventData,
        new Date('2026-04-09T12:00:01.000Z'),
        new Date('2026-04-09T12:00:02.000Z'),
      );

      expect(prisma.dailyEventStat.upsert).toHaveBeenCalledTimes(
        timezones.length,
      );
    });

    it('should read TIMEZONES from config', async () => {
      const eventData = makeEventData();

      await service.persistEvent(
        'event-id',
        eventData,
        new Date('2026-04-09T12:00:01.000Z'),
        new Date('2026-04-09T12:00:02.000Z'),
      );

      expect(config.get).toHaveBeenCalledWith('TIMEZONES');
    });

    it('should pass emittedAt derived from eventData.emittedAt into the event create call', async () => {
      const emittedAt = new Date('2026-03-15T08:30:00.000Z');
      const eventData = makeEventData({ emittedAt });

      await service.persistEvent(
        'event-id',
        eventData,
        new Date('2026-03-15T08:30:01.000Z'),
        new Date('2026-03-15T08:30:02.000Z'),
      );

      expect(prisma.event.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ emittedAt }),
        }),
      );
    });
  });
});
