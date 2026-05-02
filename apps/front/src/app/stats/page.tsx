import { PageFilters } from './page-filters';
import { searchParamsToFilters } from './search-params';
import { EventsApi } from '@/lib/api/events-api';
import { ApiClient } from '@/lib/api/api';
import { DateTime } from 'luxon';
import ChartEventsPerDay from '@/components/events/chart-events-per-day';
import ChartTopEventTypes from '@/components/events/chart-top-event-types';
import { TableEventTypes } from '@/components/events/table-event-types';
import ChartLatencyPerDay from '@/components/events/chart-latency-per-day';

function getDefaultValues() {
  return {
    from: DateTime.now().minus({ days: 6 }).toISODate(),
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

  const { body: statsByType } = await eventApi.getStatsByType({
    from: params.from,
    to: params.to,
    timeZone: params.timezone,
  });

  const {
    body: { timezones },
  } = await eventApi.getTimezones();

  return (
    <div className="flex flex-col gap-4">
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
        <ChartTopEventTypes
          title="Event type distribution"
          className="col-span-1 h-100"
          eventTypes={statsByType.types.slice(0, 5)}
          totalEvents={statsByType.total}
        />
        <TableEventTypes
          className="col-span-1 h-100"
          eventTypes={statsByType.types}
          totalEvents={statsByType.total}
        />
        <ChartLatencyPerDay
          title="Processing Latency Over Time"
          className="col-span-2 h-100"
          eventsPerDay={eventsByDay}
          from={params.from}
          to={params.to}
        />
      </div>
    </div>
  );
}
