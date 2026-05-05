import { ApiClient } from '@/lib/api/api';
import { EventsApi } from '@/lib/api/events-api';
import { UrlPagination } from '../../components/datatable/url-pagination';
import { EventsTableFilters } from './events-table-filters';
import {
  searchParamsToFilters,
  searchParamsToSortingParams,
} from './search-params';
import { EventsTable } from './events-table';

export const dynamic = 'force-dynamic';

export default async function EventsPage({
  searchParams,
}: PageProps<'/events'>) {
  const filters = searchParamsToFilters(await searchParams);
  const sortingParams = searchParamsToSortingParams(await searchParams);
  const eventApi = new EventsApi(
    new ApiClient({ baseUrl: process.env.API_URL }),
  );
  const [{ body: bodyEvents }, { body: bodyTypes }] = await Promise.all([
    eventApi.getEvents({
      from: filters.from?.toISOString() ?? undefined,
      to: filters.to?.toISOString() ?? undefined,
      page: filters.page,
      pageSize: filters.pageSize,
      type: filters.type.length > 0 ? filters.type : undefined,
      sortBy: sortingParams.sortBy ?? undefined,
      sortAsc: sortingParams.sortAsc ?? undefined,
    }),
    eventApi.getTypes(),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <EventsTableFilters
        className="basis-full"
        eventTypes={bodyTypes.types}
        values={{
          from: filters.from,
          to: filters.to,
          type: filters.type,
        }}
      />
      <EventsTable data={bodyEvents.data} sortingParams={sortingParams} />
      <UrlPagination
        totalItems={bodyEvents.total}
        page={bodyEvents.page}
        pageSize={bodyEvents.pageSize}
      />
    </div>
  );
}
