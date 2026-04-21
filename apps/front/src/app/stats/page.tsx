import { Card } from '@/components/ui/card';
import { PageFilters } from './page-filters';
import { searchParamsToFilters } from './search-params';
import { EventsApi } from '@/lib/api/events-api';
import { ApiClient } from '@/lib/api/api';
import { DateTime } from 'luxon';
import ChartEventsPerDay from '@/components/events/chart-events-per-day';

export default async function StatsPage({ searchParams }: PageProps<'/stats'>) {
  const params = searchParamsToFilters(await searchParams);
  const eventApi = new EventsApi(
    new ApiClient({ baseUrl: process.env.API_URL }),
  );

  const now = DateTime.now();
  const from = params.from
    ? DateTime.fromJSDate(params.from)
    : now.minus({ days: 7 });
  const to = params.to ? DateTime.fromJSDate(params.to) : now;
  const { body: statsByDayData } = await eventApi.getStatsByDay({
    from: from.toISODate()!,
    to: to.toISODate()!,
  });

  return (
    <div className="max-w-400 flex flex-col gap-4">
      <PageFilters
        className="basis-full"
        values={{
          from: from.toJSDate(),
          to: to.toJSDate(),
        }}
      />
      <div className="grid grid-cols-2 gap-4">
        <ChartEventsPerDay
          title="Activity over time"
          className="col-span-2 h-100"
          eventsPerDay={statsByDayData.eventsByDay}
          from={from.toISODate()}
          to={to.toISODate()}
        />
        <Card className="col-span-1">Event Type Distribution </Card>
        <Card className="col-span-1">
          {/* <ChartTopEventTypes
            className="col-span-1"
            eventTypes={overviewData.topEventTypes}
            totalEvents={overviewData.totalEvents}
          /> */}
        </Card>
        <Card className="col-span-2">Processing Latency Over Time</Card>
      </div>
      {/*
      Events by day chart
      Event type distribution chart
      Event type breakdown table
      Average processing latency by day chart if available
  */}
    </div>
  );
}
