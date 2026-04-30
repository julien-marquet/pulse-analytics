import { DateTime } from 'luxon';
import { EventsFilters } from './types';

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
