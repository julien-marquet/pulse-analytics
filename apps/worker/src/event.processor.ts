import { Job } from 'bullmq';
import { PrismaService } from './prisma.service';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { environment } from './environment';

interface AddEventJobData {
  type: string;
  id: string;
  properties: any;
}

@Processor(environment.get('EVENT_QUEUE_NAME'))
export class EventProcessor extends WorkerHost {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<AddEventJobData>): Promise<void> {
    if (job.name != environment.get('ADD_EVENT_JOB_NAME'))
      throw new Error(`Unknown job name ${job.name}`);

    await this.prisma.event.create({
      data: {
        id: job.data.id,
        type: job.data.type,
        properties: job.data.properties,
        processedAt: new Date(job.timestamp),
        receivedAt: new Date(),
      },
    });
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
