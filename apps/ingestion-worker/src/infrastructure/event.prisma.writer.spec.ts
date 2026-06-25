import { Event, Timing } from '@app/events-domain';
import {
  createPrismaServiceMock,
  PrismaServiceMock,
} from '../prisma.service.mock';
import { EventPrismaWriter } from './event.prisma.writer';

describe('EventPrismaRepository', () => {
  let writer: EventPrismaWriter;
  let prisma: PrismaServiceMock;

  beforeEach(() => {
    prisma = createPrismaServiceMock();
    writer = new EventPrismaWriter(prisma);
  });

  describe('save', () => {
    const event = Event.create({
      id: 'evt-1',
      type: 'page-viewed',
      timing: Timing.create(
        new Date('2026-01-01T00:00:00.000Z'),
        new Date('2026-01-01T00:00:00.100Z'),
        new Date('2026-01-01T00:00:00.150Z'),
      ),
      properties: { page: '/home' },
    });

    it('should call prisma.event.create with all event fields', async () => {
      await writer.save(event);

      expect(prisma.event.create).toHaveBeenCalledWith({
        data: {
          id: event.id,
          type: event.type,
          emittedAt: event.timing.emittedAt,
          receivedAt: event.timing.receivedAt,
          processedAt: event.timing.processedAt,
          properties: event.properties,
        },
      });
    });

    it('should call prisma.event.create exactly once', async () => {
      await writer.save(event);

      expect(prisma.event.create).toHaveBeenCalledTimes(1);
    });
  });
});
