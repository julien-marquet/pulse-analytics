import { ColumnDef } from '@tanstack/react-table';
import { DateTime } from 'luxon';
import { EventsSortingParams, EventsTableEntry } from './types';
import TableHeaderSortButton from '../../components/datatable/table-header-sort-button';

export function getEventsTableColumns(
  sortingParams: EventsSortingParams,
  onSortingParamsUpdate: (
    sortBy: 'emittedAt' | 'type',
    sortAsc: boolean,
  ) => void,
): ColumnDef<EventsTableEntry>[] {
  return [
    {
      accessorKey: 'emittedAt',
      header: () => {
        return (
          <TableHeaderSortButton
            activeField={sortingParams.sortBy}
            activeFieldAsc={sortingParams.sortAsc}
            field="emittedAt"
            label="EmittedAt"
            onClick={onSortingParamsUpdate}
          />
        );
      },
      cell: ({ row }) => {
        const formatted = DateTime.fromISO(row.getValue('emittedAt')).toFormat(
          'yyyy-MM-dd HH:mm:ss',
        );
        return (
          <div className="font-mono" suppressHydrationWarning>
            {formatted}
          </div>
        );
      },
    },
    {
      accessorKey: 'type',
      header: () => {
        return (
          <TableHeaderSortButton
            activeField={sortingParams.sortBy}
            activeFieldAsc={sortingParams.sortAsc}
            field="type"
            label="Type"
            onClick={onSortingParamsUpdate}
          />
        );
      },
    },
    {
      accessorKey: 'id',
      header: 'Id',
    },
  ];
}
