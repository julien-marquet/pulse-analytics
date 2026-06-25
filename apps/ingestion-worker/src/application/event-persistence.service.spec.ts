import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@app/database';
import { TypedConfigService } from '@app/common';
import { EventCandidate, EventWriter } from '@app/events-domain';
import { EventPersistenceService } from './event-persistence.service';
import { ConfigVariables } from '../config';

type EventWriterMock = DeepMockProxy<EventWriter>;

const makeCandidate = (
  overrides: Partial<EventCandidate> = {},
): EventCandidate =>
  new EventCandidate({
    id: 'event-id',
    type: 'page-viewed',
    properties: {},
    emittedAt: new Date('2026-04-09T12:00:00.000Z'),
    ...overrides,
  });

describe('EventPersistenceService', () => {
  let service: EventPersistenceService;
  let eventWriter: EventWriterMock;

  const receivedAt = new Date('2026-04-09T12:00:01.000Z');
  const processedAt = new Date('2026-04-09T12:00:02.000Z');

  beforeEach(() => {
    eventWriter = mockDeep<EventWriter>();
    service = new EventPersistenceService(
      mockDeep<PrismaClient>(),
      mockDeep<TypedConfigService<ConfigVariables>>(),
      eventWriter,
    );
  });

  describe('persistEvent', () => {
    it('should call eventWriter.save once', async () => {
      await service.persistEvent(makeCandidate(), receivedAt, processedAt);

      expect(eventWriter.save).toHaveBeenCalledTimes(1);
    });

    it('should save an Event with the candidate type and properties', async () => {
      const candidate = makeCandidate({
        type: 'button-clicked',
        properties: { page: '/home' },
      });

      await service.persistEvent(candidate, receivedAt, processedAt);

      expect(eventWriter.save).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'button-clicked',
          properties: { page: '/home' },
        }),
      );
    });

    it('should save an Event with timing derived from candidate.emittedAt, receivedAt, processedAt', async () => {
      const emittedAt = new Date('2026-04-09T12:00:00.000Z');
      const candidate = makeCandidate({ emittedAt });

      await service.persistEvent(candidate, receivedAt, processedAt);

      expect(eventWriter.save).toHaveBeenCalledWith(
        expect.objectContaining({
          timing: expect.objectContaining({
            emittedAt,
            receivedAt,
            processedAt,
          }),
        }),
      );
    });

    it('should assign a uuid as the event id', async () => {
      await service.persistEvent(makeCandidate(), receivedAt, processedAt);

      const savedEvent = eventWriter.save.mock.calls[0][0];
      expect(savedEvent.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      );
    });
  });
});
