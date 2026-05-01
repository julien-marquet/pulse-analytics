import { Job } from 'bullmq';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { EventProcessor } from './event.processor';
import { EventPersistenceService } from './event-persistence.service';
import { makeEventData } from '@app/contracts/src/event.fixtures';
import { PinoLogger } from 'nestjs-pino';

type EventPersistenceServiceMock = DeepMockProxy<EventPersistenceService>;
type PinoLoggerMock = DeepMockProxy<PinoLogger>;

const makeJob = (overrides: Partial<Job> = {}): Job =>
  ({
    data: { id: 'event-id', ...makeEventData() },
    timestamp: new Date('2026-04-09T12:00:00.000Z').getTime(),
    ...overrides,
  }) as unknown as Job;

describe('EventProcessor', () => {
  let processor: EventProcessor;
  let eventPersistenceService: EventPersistenceServiceMock;
  let logger: PinoLoggerMock;

  beforeEach(() => {
    eventPersistenceService = mockDeep<EventPersistenceService>();
    logger = mockDeep<PinoLogger>();
    processor = new EventProcessor(logger, eventPersistenceService);
  });

  describe('process', () => {
    it('should call PersistEvent with the correct arguments', async () => {
      const job = makeJob();

      await processor.process(job);

      expect(eventPersistenceService.PersistEvent).toHaveBeenCalledWith(
        job.data.id,
        job.data,
        new Date(job.timestamp),
        expect.any(Date),
      );
    });

    it('should rethrow errors from PersistEvent', async () => {
      const error = new Error('DB failure');
      eventPersistenceService.PersistEvent.mockRejectedValue(error);

      const job = makeJob();

      await expect(processor.process(job)).rejects.toThrow('DB failure');
    });

    it('should log an error when PersistEvent throws', async () => {
      const error = new Error('DB failure');
      eventPersistenceService.PersistEvent.mockRejectedValue(error);

      const job = makeJob();

      await expect(processor.process(job)).rejects.toThrow();

      expect(logger.error).toHaveBeenCalled();
    });
  });
});
