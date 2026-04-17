'use client';
import { ColumnDef } from '@tanstack/react-table';
import { DateTime } from 'luxon';

export type EventTableEntry = {
  id: string;
  type: string;
  emittedAt: string;
};

export const columns: ColumnDef<EventTableEntry>[] = [
  {
    accessorKey: 'emittedAt',
    header: 'Emitted at',
    cell: ({ row }) => {
      const formatted = DateTime.fromISO(row.getValue('emittedAt')).toFormat(
        'LLL dd HH:mm:ss',
      );
      return <div className="font-mono">{formatted}</div>;
    },
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },
  {
    accessorKey: 'id',
    header: 'Id',
  },
];
