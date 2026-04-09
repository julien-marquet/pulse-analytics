import {
  createBullmqQueueMock,
  BullmqQueueMock,
} from '../../bullmq.queue.mock';
import { EventsIngestionService } from './event-ingestion.service';
import { EventTypes } from '@app/contracts';
import { environment } from '../../environment';

const makeEventData = () =>
  ({
    type: EventTypes.PAGE_VIEWED,
    emittedAt: new Date('2026-01-01T00:00:00.000Z'),
    properties: { source: 'web', page: '/home' },
  }) as const;

describe('EventsIngestionService', () => {
  let service: EventsIngestionService;
  let queue: BullmqQueueMock;

  beforeEach(() => {
    queue = createBullmqQueueMock();
    service = new EventsIngestionService(queue);
  });

  describe('AddEvent', () => {
    it('should enqueue the event with the provided id', async () => {
      const eventData = makeEventData();
      await service.AddEvent('my-id', eventData);

      expect(queue.add).toHaveBeenCalledWith(
        environment.get('ADD_EVENT_JOB_NAME'),
        {
          id: 'my-id',
          ...eventData,
        },
      );
    });

    it('should generate a uuid when id is undefined', async () => {
      await service.AddEvent(undefined, makeEventData());

      const [, payload] = queue.add.mock.calls[0];
      expect(payload.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      );
    });

    it('should generate a unique uuid on each call when id is undefined', async () => {
      const eventData = makeEventData();
      await service.AddEvent(undefined, eventData);
      await service.AddEvent(undefined, eventData);

      const id1 = queue.add.mock.calls[0][1].id;
      const id2 = queue.add.mock.calls[1][1].id;
      expect(id1).not.toBe(id2);
    });

    it('should transfer event data into the queued payload', async () => {
      const eventData = makeEventData();
      await service.AddEvent('x', eventData);

      const [, payload] = queue.add.mock.calls[0];
      expect(payload).toMatchObject(eventData);
    });

    it('should use the job name from environment', async () => {
      await service.AddEvent('x', makeEventData());

      const [jobName] = queue.add.mock.calls[0];
      expect(jobName).toBe(environment.get('ADD_EVENT_JOB_NAME'));
    });
  });
});
