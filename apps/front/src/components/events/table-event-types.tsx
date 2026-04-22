import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export type EventTableEntry = {
  eventType: string;
  count: number;
};

type TableEventTypesProps = {
  className: string;
  eventTypes: EventTableEntry[];
  totalEvents: number;
};

type LightColumnDef = {
  getValue: (entry: EventTableEntry) => ReactNode;
  header: string;
  cellClassName?: string;
  headerClassName?: string;
};

export function TableEventTypes({
  className,
  eventTypes,
  totalEvents,
}: TableEventTypesProps) {
  const columns: LightColumnDef[] = [
    {
      getValue: (entry) => entry.eventType,
      header: 'Type',
    },
    {
      getValue: (entry) => entry.count,
      cellClassName: 'text-right font-mono',
      headerClassName: 'text-right',
      header: 'Count',
    },
    {
      getValue: (entry) => ((entry.count / totalEvents) * 100).toFixed(2),
      cellClassName: 'text-right  font-mono',
      headerClassName: 'text-right',
      header: 'Percentage',
    },
  ];

  const data = eventTypes.map((e) => ({
    ...e,
  }));

  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader>
        <CardTitle>Details</CardTitle>
      </CardHeader>
      <CardContent className="basis-full min-h-0">
        <ScrollArea
          scrollBarClassName="pt-10 pb-0 -right-4.5!"
          className="-mt-3 h-full"
        >
          <Table noWrapper>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                {columns.map((column) => {
                  return (
                    <TableHead
                      key={column.header}
                      className={column.headerClassName}
                    >
                      {column.header}
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length ? (
                data.map((entry) => (
                  <TableRow key={entry.eventType}>
                    {columns.map((column) => (
                      <TableCell
                        key={column.header}
                        className={column.cellClassName}
                      >
                        {column.getValue(entry)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
