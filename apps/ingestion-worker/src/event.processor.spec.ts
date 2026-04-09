import { Job } from 'bullmq';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { EventProcessor } from './event.processor';
import { EventPersistenceService } from './event-persistence.service';
import { makeEventData } from '@app/contracts/src/event.fixtures';
import { environment } from './environment';

type EventPersistenceServiceMock = DeepMockProxy<EventPersistenceService>;

const makeJob = (overrides: Partial<Job> = {}): Job =>
  ({
    name: environment.get('ADD_EVENT_JOB_NAME'),
    data: { id: 'event-id', ...makeEventData() },
    timestamp: new Date('2026-04-09T12:00:00.000Z').getTime(),
    ...overrides,
  }) as unknown as Job;

describe('EventProcessor', () => {
  let processor: EventProcessor;
  let eventPersistenceService: EventPersistenceServiceMock;

  beforeEach(() => {
    eventPersistenceService = mockDeep<EventPersistenceService>();
    processor = new EventProcessor(eventPersistenceService);
    jest.spyOn(console, 'info').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
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

    it('should throw when the job name is unknown', async () => {
      const job = makeJob({ name: 'unknown-job' });

      await expect(processor.process(job)).rejects.toThrow(
        'Unknown job name unknown-job',
      );
    });

    it('should not call PersistEvent when the job name is unknown', async () => {
      const job = makeJob({ name: 'unknown-job' });

      await expect(processor.process(job)).rejects.toThrow();

      expect(eventPersistenceService.PersistEvent).not.toHaveBeenCalled();
    });

    it('should rethrow errors from PersistEvent', async () => {
      const error = new Error('DB failure');
      eventPersistenceService.PersistEvent.mockRejectedValue(error);

      const job = makeJob();

      await expect(processor.process(job)).rejects.toThrow('DB failure');
    });
  });

  describe('onCompleted', () => {
    it('should not throw', () => {
      expect(() => processor.onCompleted()).not.toThrow();
    });
  });

  describe('onError', () => {
    it('should not throw', () => {
      expect(() => processor.onError(new Error('some error'))).not.toThrow();
    });
  });
});
