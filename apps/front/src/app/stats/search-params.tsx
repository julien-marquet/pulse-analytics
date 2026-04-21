import { DateTime } from 'luxon';
import { StatsFilters } from './types';

export function filtersToSearchParams(
  prevParams: URLSearchParams,
  filters: Partial<StatsFilters>,
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
  return serialized;
}

export function searchParamsToFilters(searchParams: {
  from?: string;
  to?: string;
}): StatsFilters {
  const { from, to } = searchParams;

  return {
    from: from ? DateTime.fromISO(from).toJSDate() : null,
    to: to ? DateTime.fromISO(to).toJSDate() : null,
  };
}
