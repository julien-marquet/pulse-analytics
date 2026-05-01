import { Job } from 'bullmq';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { environment } from './environment';
import { CreateEventJobData } from '@app/contracts';
import { EventPersistenceService } from './event-persistence.service';
import { PinoLogger } from 'nestjs-pino';

@Processor(environment.get('EVENT_QUEUE_NAME'))
export class EventProcessor extends WorkerHost {
  constructor(
    private readonly logger: PinoLogger,
    private readonly eventPersistenceService: EventPersistenceService,
  ) {
    super();
    logger.setContext(EventProcessor.name);
  }

  async process(job: Job<CreateEventJobData>): Promise<void> {
    const metrics = {
      jobId: job.id,
      eventId: job.data.id,
      eventType: job.data.type,
      queueLatency: Date.now() - job.timestamp,
      attemptsMade: job.attemptsMade,
    };

    const startTime = Date.now();

    try {
      await this.eventPersistenceService.PersistEvent(
        job.data.id,
        job.data,
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
