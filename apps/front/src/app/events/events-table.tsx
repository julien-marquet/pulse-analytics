'use client';

import { ServerDataTable } from '@/components/datatable/server-datatable';
import { getEventsTableColumns } from './events-table-columns';
import { EventsSortingParams, EventsTableEntry } from './types';
import { useRouter, useSearchParams } from 'next/navigation';
import { sortingParamsToSearchParams } from './search-params';

interface EventsTableProps {
  data: EventsTableEntry[];
  sortingParams: EventsSortingParams;
}

export function EventsTable({ data, sortingParams }: EventsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSortingParamsUpdate(
    sortBy: 'emittedAt' | 'type',
    sortAsc: boolean,
  ) {
    const params = sortingParamsToSearchParams(searchParams, {
      sortBy,
      sortAsc,
    });
    router.push(`?${params.toString()}`);
  }

  return (
    <ServerDataTable
      tableClassName="table-fixed"
      columns={getEventsTableColumns(sortingParams, handleSortingParamsUpdate)}
      data={data}
    />
  );
}
