import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePaginationRange } from '@/hooks/use-pagination-range';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

const DefaultPageSizeOptions = [5, 10, 25, 50];

type PaginationBarProps = {
  page: number;
  pageSize: number;
  totalItems: number;
  pageSizeOptions?: number[];
  setPagination: (page: number, pageSize: number) => void;
};
export function PaginationBar({
  page,
  pageSize,
  totalItems,
  pageSizeOptions = DefaultPageSizeOptions,
  setPagination,
}: PaginationBarProps) {
  const {
    pages,
    showLeftEllipsis,
    showRightEllipsis,
    canNextPage,
    canPreviousPage,
  } = usePaginationRange({
    page,
    pageSize,
    totalItems,
  });

  function setPage(page: number) {
    setPagination(page, pageSize);
  }
  function setPageSize(pageSize: number) {
    const nextPage = Math.min(page, Math.ceil(totalItems / pageSize));
    setPagination(nextPage, pageSize);
  }

  return (
    <div className="grid grid-cols-[1fr_auto_1fr]">
      <div className="flex items-center justify-between gap-3 max-sm:flex-col">
        <p
          className="text-muted-foreground flex-1 text-sm whitespace-nowrap"
          aria-live="polite"
        >
          {totalItems} results
        </p>
      </div>
      <div className="grow">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                size="icon"
                variant="outline"
                className="disabled:pointer-events-none disabled:opacity-50"
                onClick={() => setPage(page - 1)}
                disabled={!canPreviousPage}
                aria-label="Go to previous page"
              >
                <ChevronLeftIcon aria-hidden="true" />
              </Button>
            </PaginationItem>

            {showLeftEllipsis ? (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <div className="w-9"></div>
            )}

            {pages.map((i) => {
              const isActive = i === page;
              return (
                <PaginationItem key={i}>
                  <Button
                    size="icon"
                    variant={`${isActive ? 'outline' : 'ghost'}`}
                    onClick={() => setPage(i)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {i}
                  </Button>
                </PaginationItem>
              );
            })}

            {showRightEllipsis ? (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <div className="w-9"></div>
            )}

            <PaginationItem>
              <Button
                size="icon"
                variant="outline"
                className="disabled:pointer-events-none disabled:opacity-50"
                onClick={() => setPage(page + 1)}
                disabled={!canNextPage}
                aria-label="Go to next page"
              >
                <ChevronRightIcon aria-hidden="true" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <div className="flex flex-1 justify-end">
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => {
            setPageSize(Number(value));
          }}
        >
          <SelectTrigger
            id="results-per-page"
            className="w-fit whitespace-nowrap"
            aria-label="Results per page"
          >
            <SelectValue placeholder="Select number of results" />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((pageSize) => (
              <SelectItem key={pageSize} value={pageSize.toString()}>
                {pageSize} / page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
