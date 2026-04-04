import { Job } from 'bullmq';
import { PrismaService } from './prisma.service';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { environment } from './environment';
import { Prisma } from 'packages/database/generated';
import { CreateEventJobData } from '@app/contracts';

@Processor(environment.get('EVENT_QUEUE_NAME'))
export class EventProcessor extends WorkerHost {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<CreateEventJobData>): Promise<void> {
    if (job.name != environment.get('ADD_EVENT_JOB_NAME'))
      throw new Error(`Unknown job name ${job.name}`);

    try {
      const receivedAt = new Date(job.timestamp);
      const emittedAt = new Date(job.data.emittedAt);
      const processedAt = new Date();

      await this.prisma.$transaction([
        this.prisma.event.create({
          data: {
            id: job.data.id,
            type: job.data.type,
            properties: job.data.properties as unknown as Prisma.InputJsonValue,
            processedAt,
            emittedAt,
            receivedAt,
          },
        }),
        ...this.getDailyEventsStatsUpsertQueries(
          job.data,
          emittedAt,
          receivedAt,
          processedAt,
        ),
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
    jobData: CreateEventJobData,
    emittedAt: Date,
    receivedAt: Date,
    processedAt: Date,
  ) {
    const queries = [];

    const jobProcessingLatency = processedAt.valueOf() - receivedAt.valueOf();

    for (const timezone of environment.get('TIMEZONES')) {
      const dayDateInTimezone = startOfDayUTC(emittedAt, timezone);
      queries.push(
        this.prisma.dailyEventStat.upsert({
          where: {
            date_eventType_timeZone: {
              timeZone: timezone,
              date: dayDateInTimezone,
              eventType: jobData.type,
            },
          },
          create: {
            timeZone: timezone,
            eventType: jobData.type,
            count: 1,
            date: dayDateInTimezone,
            processingLatencyTotalMs: jobProcessingLatency,
          },
          update: {
            count: { increment: 1 },
            processingLatencyTotalMs: { increment: jobProcessingLatency },
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

/**
 * Returns a Date representing UTC midnight of the calendar date
 * that `date` falls on in the given IANA timezone.
 *
 * @param date - The source date/time.
 * @param timeZone - An IANA timezone name (e.g. `"America/New_York"`).
 * @returns A Date at UTC midnight of the local calendar date in that timezone.
 *
 * @example
 * // 2026-03-31 01:00 UTC is still 2026-03-30 in New York (UTC-4)
 * startOfDayUTC(new Date('2026-03-31T01:00:00Z'), 'America/New_York');
 * // → 2026-03-30T00:00:00.000Z
 */
export function startOfDayUTC(date: Date, timeZone: string = 'UTC'): Date {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const year = parseInt(parts.find((p) => p.type === 'year')!.value);
  const month = parseInt(parts.find((p) => p.type === 'month')!.value);
  const day = parseInt(parts.find((p) => p.type === 'day')!.value);

  return new Date(Date.UTC(year, month - 1, day));
}
