import { DateTime } from 'luxon';
import { EventsFilters, EventsSortingParams } from './types';

export const defaultPage = 1;
export const defaultPageSize = 25;

export function filtersToSearchParams(
  prevParams: URLSearchParams,
  filters: Partial<EventsFilters>,
): URLSearchParams {
  const serialized = new URLSearchParams(prevParams);
  if (filters.from != null) {
    serialized.set('from', String(filters.from?.toISOString()));
  } else if (filters.from == null) {
    serialized.delete('from');
  }
  if (filters.to != null) {
    serialized.set('to', String(filters.to?.toISOString()));
  } else if (filters.to == null) {
    serialized.delete('to');
  }
  if (filters.type != null && filters.type.length > 0) {
    serialized.set('type', String(filters.type?.join(',')));
  } else if (filters.type === null || filters.type?.length === 0) {
    serialized.delete('type');
  }
  if (filters.page != undefined) {
    serialized.set('page', String(filters.page));
  }
  if (filters.pageSize != undefined) {
    serialized.set('pageSize', String(filters.pageSize));
  }
  return serialized;
}

export function searchParamsToFilters(searchParams: {
  from?: string;
  to?: string;
  page?: string;
  pageSize?: string;
  type?: string;
}): EventsFilters {
  const { from, to, page, pageSize, type } = searchParams;

  return {
    from: from ? DateTime.fromISO(from).toJSDate() : null,
    to: to ? DateTime.fromISO(to).toJSDate() : null,
    type: type ? type.split(',') : [],
    page: page ? parseInt(page) : defaultPage,
    pageSize: pageSize ? parseInt(pageSize) : defaultPageSize,
  };
}

const defaultApiSortBy = 'emittedAt';
const defaultApiSortAsc = false;

export function sortingParamsToSearchParams(
  prevParams: URLSearchParams,
  sortingParams: Partial<EventsSortingParams>,
): URLSearchParams {
  const serialized = new URLSearchParams(prevParams);
  if (
    sortingParams.sortBy != null &&
    sortingParams.sortBy !== defaultApiSortBy
  ) {
    serialized.set('sortBy', sortingParams.sortBy);
  } else {
    serialized.delete('sortBy');
  }

  if (
    sortingParams.sortAsc != null &&
    sortingParams.sortAsc !== defaultApiSortAsc
  ) {
    serialized.set('sortAsc', String(sortingParams.sortAsc));
  } else {
    serialized.delete('sortAsc');
  }
  return serialized;
}

export function searchParamsToSortingParams(searchParams: {
  sortBy?: string;
  sortAsc?: string;
}): EventsSortingParams {
  const { sortBy, sortAsc } = searchParams;

  return {
    sortBy:
      sortBy && ['emittedAt', 'type'].includes(sortBy)
        ? (sortBy as EventsSortingParams['sortBy'])
        : defaultApiSortBy,
    sortAsc:
      sortAsc === 'true'
        ? true
        : sortAsc === 'false'
          ? false
          : defaultApiSortAsc,
  };
}
