import { DateTime } from 'luxon';
import { EventFilters } from './types';
import { defaultPage, defaultPageSize } from './consts';

export function serializeToSearchParams(
  prevParams: URLSearchParams,
  filters: Partial<EventFilters>,
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

export function getPageParamsFromUrl(searchParams: {
  from?: string;
  to?: string;
  page?: string;
  pageSize?: string;
  type?: string;
}): EventFilters {
  const { from, to, page, pageSize, type } = searchParams;

  return {
    from: from ? DateTime.fromISO(from).toJSDate() : null,
    to: to ? DateTime.fromISO(to).toJSDate() : null,
    type: type ? type.split(',') : [],
    page: page ? parseInt(page) : defaultPage,
    pageSize: pageSize ? parseInt(pageSize) : defaultPageSize,
  };
}
