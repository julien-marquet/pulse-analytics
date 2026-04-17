'use client';

import { PaginationBar } from '@/components/ui/pagination-bar';
import { useSearchParams, useRouter } from 'next/navigation';

type UrlPaginationProps = {
  totalItems: number;
  page: number;
  pageSize: number;
};

export function UrlPagination({
  totalItems,
  page,
  pageSize,
}: UrlPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handlePaginationChange(page: number, pageSize: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    params.set('pageSize', String(pageSize));
    router.push(`?${params.toString()}`);
  }

  return (
    <PaginationBar
      page={page}
      pageSize={pageSize}
      totalItems={totalItems}
      setPagination={handlePaginationChange}
    />
  );
}
