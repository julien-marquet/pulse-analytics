import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from './prisma.service';
import { randomUUID } from 'crypto';

interface UserEvent {
  type: string;
  properties: any;
}

@Processor('event')
export class EventProcessor extends WorkerHost {
  constructor(private prisma: PrismaService) {
    super();
  }

  async process(job: Job<UserEvent>): Promise<any> {
    try {
      await this.prisma.event.create({
        data: {
          id: randomUUID().toString(),
          eventType: job.data.type,
          properties: job.data.properties,
          processedAt: new Date(job.timestamp),
          receivedAt: new Date(),
        },
      });
    } catch (err) {
      console.error(err);
    }
    return 'ok';
  }

  @OnWorkerEvent('completed')
  onCompleted() {
    console.info('completed');
  }

  @OnWorkerEvent('error')
  onError() {
    console.error('error');
  }
}
