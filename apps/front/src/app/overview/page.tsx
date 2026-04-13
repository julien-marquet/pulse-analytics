import TopEventTypes from '@/components/events/top-events';
import { KpiItem } from '@/components/ui/kpi';
import { ApiClient } from '@/lib/api/api';
import { EventsApi } from '@/lib/api/events-api';
import { DateTime } from 'luxon';

export default async function OverviewPage() {
  const eventApi = new EventsApi(
    new ApiClient({ baseUrl: process.env.API_URL }),
  );

  const now = DateTime.now();
  const from = now.minus({ days: 7 }).toISODate()!;
  const to = now.toISODate()!;

  const { data: overviewData } = await eventApi.getStatsOverview({
    from,
    to,
  });

  const { data: statsByDayData } = await eventApi.getStatsByDay({
    from,
    to,
  });

  console.log(overviewData);
  console.log(statsByDayData);

  const lastReceived = overviewData.latestEventAt
    ? DateTime.fromISO(overviewData.latestEventAt).toRelative()
    : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-4 gap-4">
        <KpiItem
          className="col-span-1"
          label="Total"
          value={overviewData.totalEvents.toString()}
        />
        <KpiItem
          label="Types"
          value={overviewData.eventTypesCount.toString()}
        />
        <KpiItem
          label="Latency"
          value={
            overviewData.averageProcessingLatencyMs
              ? overviewData.averageProcessingLatencyMs.toString()
              : 'X'
          }
          unit="ms"
        />
        <KpiItem label="Last received" value={lastReceived ?? 'X'} />
      </div>
      <TopEventTypes eventTypes={overviewData.topEventTypes} />
    </div>
  );
}
