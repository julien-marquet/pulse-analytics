import { Card } from '@/components/ui/card';
import { PageFilters } from './page-filters';
import { searchParamsToFilters } from './search-params';
import { EventsApi } from '@/lib/api/events-api';
import { ApiClient } from '@/lib/api/api';
import { DateTime } from 'luxon';
import ChartEventsPerDay from '@/components/events/chart-events-per-day';

function getDefaultValues() {
  return {
    from: DateTime.now().minus({ days: 7 }).toISODate(),
    to: DateTime.now().toISODate(),
    timezone: 'UTC',
  };
}

export default async function StatsPage({ searchParams }: PageProps<'/stats'>) {
  const defaultValues = getDefaultValues();
  const params = searchParamsToFilters(await searchParams, defaultValues);
  const eventApi = new EventsApi(
    new ApiClient({ baseUrl: process.env.API_URL }),
  );

  const {
    body: { eventsByDay },
  } = await eventApi.getStatsByDay({
    from: params.from,
    to: params.to,
  });

  const {
    body: { timezones },
  } = await eventApi.getTimezones();

  return (
    <div className="max-w-400 flex flex-col gap-4">
      <PageFilters
        className="basis-full"
        timezones={timezones}
        values={{
          from: params.from,
          to: params.to,
          timezone: params.timezone,
        }}
        defaultValues={defaultValues}
      />
      <div className="grid grid-cols-2 gap-4">
        <ChartEventsPerDay
          title="Activity over time"
          className="col-span-2 h-100"
          eventsPerDay={eventsByDay}
          from={params.from}
          to={params.to}
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
