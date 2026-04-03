import { Job } from 'bullmq';
import { PrismaService } from './prisma.service';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { environment } from './environment';
import { Prisma } from 'packages/database/generated';

interface AddEventJobData {
  receivedAt: Date;
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
      const serverReceivedAt = new Date(job.timestamp);
      const clientReceivedAt = new Date(job.data.receivedAt);

      await this.prisma.$transaction([
        this.prisma.event.create({
          data: {
            id: job.data.id,
            type: job.data.eventType,
            properties: job.data.properties,
            processedAt: new Date(),
            clientReceivedAt,
            serverReceivedAt,
          },
        }),
        ...this.getDailyEventsStatsUpsertQueries(job.data, clientReceivedAt),
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
