type usePaginationRangeProps = {
  page: number;
  pageSize: number;
  totalItems: number;
  paginationItemsToDisplay?: number;
};

export function usePaginationRange({
  page,
  pageSize,
  totalItems,
  paginationItemsToDisplay = 3,
}: usePaginationRangeProps) {
  const totalPages = Math.ceil(totalItems / pageSize);

  function calculatePaginationRange(): number[] {
    if (totalPages <= paginationItemsToDisplay) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const halfDisplay = Math.floor(paginationItemsToDisplay / 2);

    const initialRange = {
      start: page - halfDisplay,
      end: page + halfDisplay,
    };

    const adjustedRange = {
      start: Math.max(1, initialRange.start),
      end: Math.min(totalPages, initialRange.end),
    };

    if (adjustedRange.start === 1) {
      adjustedRange.end = Math.min(paginationItemsToDisplay, totalPages);
    }

    if (adjustedRange.end === totalPages) {
      adjustedRange.start = Math.max(
        1,
        totalPages - paginationItemsToDisplay + 1,
      );
    }

    return Array.from(
      { length: adjustedRange.end - adjustedRange.start + 1 },
      (_, i) => adjustedRange.start + i,
    );
  }

  const pages = calculatePaginationRange();

  const showLeftEllipsis = pages.length > 0 && pages[0] > 1;
  const showRightEllipsis =
    pages.length > 0 && pages[pages.length - 1] < totalPages;

  return {
    pages,
    showLeftEllipsis,
    showRightEllipsis,
    canPreviousPage: page > 1,
    canNextPage: page < totalPages,
  };
}
