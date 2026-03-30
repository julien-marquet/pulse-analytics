import { Job } from 'bullmq';
import { PrismaService } from './prisma.service';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { environment } from './environment';
import { Prisma } from 'packages/database/generated';
import { DateHelpers } from '@app/common';

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

    try {
      const receivedAt = new Date(job.timestamp);
      const roundedDate = DateHelpers.roundDateToDay(receivedAt);

      await this.prisma.$transaction([
        this.prisma.event.create({
          data: {
            id: job.data.id,
            type: job.data.type,
            properties: job.data.properties,
            processedAt: new Date(),
            receivedAt,
          },
        }),
        this.prisma.dailyEventsStats.upsert({
          where: {
            date_type: {
              date: roundedDate,
              type: job.data.type,
            },
          },
          create: {
            type: job.data.type,
            count: 1,
            date: roundedDate,
          },
          update: {
            count: { increment: 1 },
          },
        }),
      ]);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        console.error(`Prisma error ${err.code}:`, err.meta, err.message);
      } else {
        throw err;
      }
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
