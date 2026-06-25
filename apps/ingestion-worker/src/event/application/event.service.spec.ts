import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { EventCandidate, EventWriter } from '@app/events-domain';
import { EventService } from './event.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

type EventWriterMock = DeepMockProxy<EventWriter>;
type EventEmitter2Mock = DeepMockProxy<EventEmitter2>;

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

describe('EventService', () => {
  let service: EventService;
  let eventWriter: EventWriterMock;
  let eventEmitter: EventEmitter2Mock;

  const receivedAt = new Date('2026-04-09T12:00:01.000Z');
  const processedAt = new Date('2026-04-09T12:00:02.000Z');

  beforeEach(() => {
    eventWriter = mockDeep<EventWriter>();
    eventEmitter = mockDeep<EventEmitter2>();
    service = new EventService(eventWriter, eventEmitter);
  });

  describe('createEvent', () => {
    it('should call eventWriter.save once', async () => {
      await service.createEvent(makeCandidate(), receivedAt, processedAt);

      expect(eventWriter.save).toHaveBeenCalledTimes(1);
    });

    it('should save an Event with the candidate type and properties', async () => {
      const candidate = makeCandidate({
        type: 'button-clicked',
        properties: { page: '/home' },
      });

      await service.createEvent(candidate, receivedAt, processedAt);

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

      await service.createEvent(candidate, receivedAt, processedAt);

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
      await service.createEvent(makeCandidate(), receivedAt, processedAt);

      const savedEvent = eventWriter.save.mock.calls[0][0];
      expect(savedEvent.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      );
    });

    it('should emit event.created after saving', async () => {
      await service.createEvent(makeCandidate(), receivedAt, processedAt);

      expect(eventEmitter.emit).toHaveBeenCalledTimes(1);
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'event.created',
        expect.objectContaining({ type: 'page-viewed' }),
      );
    });

    it('should emit the same event object that was saved', async () => {
      await service.createEvent(makeCandidate(), receivedAt, processedAt);

      const savedEvent = eventWriter.save.mock.calls[0][0];
      const emittedEvent = eventEmitter.emit.mock.calls[0][1];
      expect(emittedEvent).toBe(savedEvent);
    });

    it('should not emit if save throws', async () => {
      eventWriter.save.mockRejectedValue(new Error('DB failure'));

      await expect(
        service.createEvent(makeCandidate(), receivedAt, processedAt),
      ).rejects.toThrow('DB failure');

      expect(eventEmitter.emit).not.toHaveBeenCalled();
    });
  });
});
