import { Job } from 'bullmq';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { environment } from './environment';
import { CreateEventJobData } from '@app/contracts';
import { EventPersistenceService } from './event-persistence.service';

@Processor(environment.get('EVENT_QUEUE_NAME'))
export class EventProcessor extends WorkerHost {
  constructor(
    private readonly eventPersistenceService: EventPersistenceService,
  ) {
    super();
  }

  async process(job: Job<CreateEventJobData>): Promise<void> {
    if (job.name != environment.get('ADD_EVENT_JOB_NAME'))
      throw new Error(`Unknown job name ${job.name}`);

    try {
      await this.eventPersistenceService.PersistEvent(
        job.data.id,
        job.data,
        new Date(job.timestamp),
        new Date(),
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(): void {
    console.info('completed');
  }

  @OnWorkerEvent('error')
  onError(error: Error): void {
    console.error(error);
  }
}
