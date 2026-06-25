import { Event, Timing } from '@app/events-domain';
import { getUTCMidnightForTimezone } from '@app/common';
import {
  createPrismaServiceMock,
  PrismaServiceMock,
} from '../../prisma.service.mock';
import { EventStatsPrismaWriter } from './event-stats.prisma.writer';

const emittedAt = new Date('2026-04-09T12:00:00.000Z');
const receivedAt = new Date('2026-04-09T12:00:00.100Z');
const processedAt = new Date('2026-04-09T12:00:00.150Z');

const makeEvent = () =>
  Event.create({
    id: 'evt-1',
    type: 'page-viewed',
    timing: Timing.create(emittedAt, receivedAt, processedAt),
    properties: {},
  });

describe('EventStatsPrismaWriter', () => {
  let writer: EventStatsPrismaWriter;
  let prisma: PrismaServiceMock;

  beforeEach(() => {
    prisma = createPrismaServiceMock();
    writer = new EventStatsPrismaWriter(prisma);
  });

  describe('save', () => {
    it('should call prisma.dailyEventStat.upsert exactly once', async () => {
      await writer.save(makeEvent(), 'UTC');

      expect(prisma.dailyEventStat.upsert).toHaveBeenCalledTimes(1);
    });

    it('should upsert with correct where clause for the timezone day', async () => {
      const event = makeEvent();
      const timezone = 'America/New_York';
      const expectedDate = getUTCMidnightForTimezone(emittedAt, timezone);

      await writer.save(event, timezone);

      expect(prisma.dailyEventStat.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            date_eventType_timeZone: {
              timeZone: timezone,
              date: expectedDate,
              eventType: event.type,
            },
          },
        }),
      );
    });

    it('should create with count 1 and correct processingLatencyTotalMs', async () => {
      const event = makeEvent();

      await writer.save(event, 'UTC');

      expect(prisma.dailyEventStat.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: {
            timeZone: 'UTC',
            eventType: event.type,
            count: 1,
            date: getUTCMidnightForTimezone(emittedAt, 'UTC'),
            processingLatencyTotalMs: event.latencies.processingLatencyMs,
          },
        }),
      );
    });

    it('should update by incrementing count and processingLatencyTotalMs', async () => {
      const event = makeEvent();

      await writer.save(event, 'UTC');

      expect(prisma.dailyEventStat.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          update: {
            count: { increment: 1 },
            processingLatencyTotalMs: {
              increment: event.latencies.processingLatencyMs,
            },
          },
        }),
      );
    });
  });
});
