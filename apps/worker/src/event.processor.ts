import { Job } from 'bullmq';
import { PrismaService } from './prisma.service';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { environment } from './environment';
import { Prisma } from 'packages/database/generated';
import { startOfDayUTC } from 'packages/common/src/date.helpers';

interface AddEventJobData {
  eventType: string;
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
      await this.prisma.$transaction([
        this.prisma.event.create({
          data: {
            id: job.data.id,
            type: job.data.eventType,
            properties: job.data.properties,
            processedAt: new Date(),
            receivedAt,
          },
        }),
        ...this.getDailyEventsStatsUpsertQueries(job.data, receivedAt),
      ]);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        console.error(`Prisma error ${err.code}:`, err.meta, err.message);
      } else {
        throw err;
      }
    }
  }

  private getDailyEventsStatsUpsertQueries(
    jobData: AddEventJobData,
    receivedAt: Date,
  ) {
    const queries = [];
    for (const timezone of environment.get('TIMEZONES')) {
      const dayDateInTimezone = startOfDayUTC(receivedAt, timezone);
      queries.push(
        this.prisma.dailyEventStat.upsert({
          where: {
            date_eventType_timeZone: {
              timeZone: timezone,
              date: dayDateInTimezone,
              eventType: jobData.eventType,
            },
          },
          create: {
            timeZone: timezone,
            eventType: jobData.eventType,
            count: 1,
            date: dayDateInTimezone,
          },
          update: {
            count: { increment: 1 },
          },
        }),
      );
    }
    return queries;
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
