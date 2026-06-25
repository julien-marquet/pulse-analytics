import {
  createBullmqQueueMock,
  BullmqQueueMock,
} from '../../bullmq.queue.mock';
import {
  CreateEventQuery,
  EventsIngestionService,
} from './event-ingestion.service';
import { EventPublisher } from './event.publisher';
import { EventBullMqPublisher } from '../infrastructure/event.bullmq.publisher';

export function makeCreateEventQuery(
  overrides: Partial<CreateEventQuery> = {},
): CreateEventQuery {
  return {
    type: 'page-viewed',
    emittedAt: new Date('2026-01-01T00:00:00.000Z'),
    properties: {},
    ...overrides,
  };
}

describe('EventsIngestionService', () => {
  let service: EventsIngestionService;
  let eventPublisher: EventPublisher;
  let queue: BullmqQueueMock;

  beforeEach(() => {
    queue = createBullmqQueueMock();
    eventPublisher = new EventBullMqPublisher(queue);
    service = new EventsIngestionService(eventPublisher);
  });

  describe('addEvent', () => {
    it('should enqueue a job with the event data', async () => {
      const query = makeCreateEventQuery();

      await service.addEvent(query);

      expect(queue.add).toHaveBeenCalledTimes(1);
      const [, payload] = queue.add.mock.calls[0];
      expect(payload).toMatchObject({
        type: query.type,
        properties: query.properties,
        emittedAt: query.emittedAt.toISOString(),
      });
    });

    it('should generate a uuid for the event id', async () => {
      await service.addEvent(makeCreateEventQuery());

      const [, payload] = queue.add.mock.calls[0];
      expect(payload.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });

    it('should enqueue each event with a distinct id', async () => {
      await service.addEvent(makeCreateEventQuery());
      await service.addEvent(makeCreateEventQuery());

      const [[, first], [, second]] = queue.add.mock.calls;
      expect(first.id).not.toEqual(second.id);
    });

    it('should configure the job with fixed backoff retry options', async () => {
      await service.addEvent(makeCreateEventQuery());

      const [, , options] = queue.add.mock.calls[0];
      expect(options).toMatchObject({
        attempts: 2,
        backoff: { type: 'fixed', delay: 3000 },
      });
    });
  });
});
