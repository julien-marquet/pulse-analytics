import { times } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Skeleton } from '../ui/skeleton';

type SkeletonTableProps = {
  rows?: number;
  cols?: number;
};

export function SkeletonTable({ cols = 3, rows = 25 }: SkeletonTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {times(cols)((i) => (
              <TableHead key={i}>
                <Skeleton className="h-[19.25px] w-30" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {times(rows)((ir) => (
            <TableRow key={ir}>
              {times(cols)((ic) => (
                <TableCell key={ic}>
                  <Skeleton className="h-5 w-60" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
