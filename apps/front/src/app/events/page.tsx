import { ApiClient } from '@/lib/api/api';
import { EventsApi } from '@/lib/api/events-api';
import { ServerDataTable } from '../../components/datatable/server-datatable';
import { columns } from './columns';
import { UrlPagination } from '../../components/datatable/url-pagination';
import { EventsFilters } from './events-filters';
import { getPageParamsFromUrl } from './parse-filters';

export default async function EventsPage({
  searchParams,
}: PageProps<'/events'>) {
  const params = getPageParamsFromUrl(await searchParams);
  const eventApi = new EventsApi(
    new ApiClient({ baseUrl: process.env.API_URL }),
  );
  const [{ body: bodyEvents }, { body: bodyTypes }] = await Promise.all([
    eventApi.getEvents({
      from: params.from?.toISOString() ?? undefined,
      to: params.to?.toISOString() ?? undefined,
      page: params.page,
      pageSize: params.pageSize,
      type: params.type.length > 0 ? params.type : undefined,
    }),
    eventApi.getTypes(),
  ]);

  return (
    <div className="max-w-400 flex flex-col gap-4">
      <EventsFilters
        className="basis-full"
        eventTypes={bodyTypes.types}
        values={{
          from: params.from,
          to: params.to,
          type: params.type,
        }}
      />
      <ServerDataTable columns={columns} data={bodyEvents.data} />
      <UrlPagination
        totalItems={bodyEvents.total}
        page={bodyEvents.page}
        pageSize={bodyEvents.pageSize}
      />
    </div>
  );
}
