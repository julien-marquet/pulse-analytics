import { ApiClient } from '@/lib/api/api';
import { EventsApi } from '@/lib/api/events-api';

export default async function OverviewPage() {
  const eventApi = new EventsApi(
    new ApiClient({ baseUrl: process.env.API_URL }),
  );

  const { data } = await eventApi.getStatsOverview({
    from: '2000-01-02',
    to: '2050-01-02',
  });

  console.log(data);
  return 'Overview';
}
