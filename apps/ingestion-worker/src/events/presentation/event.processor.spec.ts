import { Job } from 'bullmq';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { EventProcessor } from './event.processor';
import { EventService } from '../application/event.service';
import { PinoLogger } from 'nestjs-pino';
import { EventCandidate } from '@app/events-domain';
import { CreateEventDto } from './createEvent.dto';

export function makeEventData(
  overrides: Partial<CreateEventDto> = {},
): CreateEventDto {
  return {
    id: 'TEST_ID',
    type: 'page-viewed',
    emittedAt: '2026-01-01T00:00:00.000Z',
    properties: {},
    ...overrides,
  };
}

type EventPersistenceServiceMock = DeepMockProxy<EventService>;
type PinoLoggerMock = DeepMockProxy<PinoLogger>;

const makeJob = (overrides: Partial<Job> = {}): Job =>
  ({
    data: makeEventData({ id: 'event-id' }),
    timestamp: new Date('2026-04-09T12:00:00.000Z').getTime(),
    ...overrides,
  }) as unknown as Job;

describe('EventProcessor', () => {
  let processor: EventProcessor;
  let eventPersistenceService: EventPersistenceServiceMock;
  let logger: PinoLoggerMock;

  beforeEach(() => {
    eventPersistenceService = mockDeep<EventService>();
    logger = mockDeep<PinoLogger>();
    processor = new EventProcessor(logger, eventPersistenceService);
  });

  describe('process', () => {
    it('should call persistEvent with the correct arguments', async () => {
      const job = makeJob();

      await processor.process(job);

      expect(eventPersistenceService.createEvent).toHaveBeenCalledWith(
        new EventCandidate({
          id: job.data.id,
          type: job.data.type,
          properties: job.data.properties,
          emittedAt: new Date(job.data.emittedAt),
        }),
        new Date(job.timestamp),
        expect.any(Date),
      );
    });

    it('should rethrow errors from persistEvent', async () => {
      const error = new Error('DB failure');
      eventPersistenceService.createEvent.mockRejectedValue(error);

      const job = makeJob();

      await expect(processor.process(job)).rejects.toThrow('DB failure');
    });

    it('should log an error when persistEvent throws', async () => {
      const error = new Error('DB failure');
      eventPersistenceService.createEvent.mockRejectedValue(error);

      const job = makeJob();

      await expect(processor.process(job)).rejects.toThrow();

      expect(logger.error).toHaveBeenCalled();
    });
  });
});
