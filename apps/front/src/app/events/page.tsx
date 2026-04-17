import { ApiClient } from '@/lib/api/api';
import { EventsApi, GetEventsRequestParams } from '@/lib/api/events-api';
import { ServerDataTable } from '../../components/datatable/server-datatable';
import { columns } from './columns';
import { UrlPagination } from '../../components/datatable/url-pagination';
import { EventsFilters } from './filters';

async function prepareApiCallParams(
  searchParams: Promise<{
    from?: string;
    to?: string;
    page?: string;
    pageSize?: string;
    type?: string;
  }>,
): Promise<GetEventsRequestParams> {
  const { from, to, page, pageSize, type } = await searchParams;
  new URLSearchParams();
  return {
    from,
    to,
    page: page ? parseInt(page) : undefined,
    pageSize: pageSize ? parseInt(pageSize) : undefined,
    type: type ? type.split(',') : undefined,
  };
}

export default async function EventsPage({
  searchParams,
}: PageProps<'/events'>) {
  const apiParams = await prepareApiCallParams(searchParams);
  const eventApi = new EventsApi(
    new ApiClient({ baseUrl: process.env.API_URL }),
  );

  const [{ body: bodyEvents }, { body: bodyTypes }] = await Promise.all([
    eventApi.getEvents(apiParams),
    eventApi.getTypes(),
  ]);

  console.log(bodyTypes);
  return (
    <div className="max-w-400 flex flex-col gap-4">
      <EventsFilters className="basis-full" eventTypes={bodyTypes.types} />
      <ServerDataTable columns={columns} data={bodyEvents.data} />
      <UrlPagination
        totalItems={bodyEvents.total}
        page={bodyEvents.page}
        pageSize={bodyEvents.pageSize}
      />
    </div>
  );
}
