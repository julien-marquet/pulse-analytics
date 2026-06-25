import { Job } from 'bullmq';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { environment } from '../../environment';
import { EventService } from '../application/event.service';
import { PinoLogger } from 'nestjs-pino';
import { CreateEventDto } from './createEvent.dto';
import { EventCandidate } from '@app/events-domain';

@Processor(environment.get('EVENT_QUEUE_NAME'))
export class EventProcessor extends WorkerHost {
  constructor(
    private readonly logger: PinoLogger,
    private readonly eventPersistenceService: EventService,
  ) {
    super();
    logger.setContext(EventProcessor.name);
  }

  async process(job: Job<CreateEventDto>): Promise<void> {
    const metrics = {
      jobId: job.id,
      eventId: job.data.id,
      eventType: job.data.type,
      queueLatency: Date.now() - job.timestamp,
      attemptsMade: job.attemptsMade,
    };

    const startTime = Date.now();

    try {
      await this.eventPersistenceService.createEvent(
        new EventCandidate({
          ...job.data,
          emittedAt: new Date(job.data.emittedAt),
        }),
        new Date(job.timestamp),
        new Date(),
      );

      this.logger.info({
        msg: 'Event processed',
        ...metrics,
        processingTimeMs: Date.now() - startTime,
      });
    } catch (err: unknown) {
      this.logger.error({
        msg: 'Failed to process event',
        ...metrics,
        processingTimeMs: Date.now() - startTime,
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
      });
      throw err;
    }
  }
}
