import { StatsFilters } from './types';

export function filtersToSearchParams(
  filters: Partial<StatsFilters>,
  defaultValues: StatsFilters,
): URLSearchParams {
  const serialized = new URLSearchParams();
  if (filters.from && filters.from !== defaultValues.from) {
    serialized.set('from', filters.from);
  }
  if (filters.to && filters.to !== defaultValues.to) {
    serialized.set('to', filters.to);
  }
  if (filters.timezone && filters.timezone !== defaultValues.timezone) {
    serialized.set('timezone', String(filters.timezone));
  }
  return serialized;
}

export function searchParamsToFilters(
  searchParams: {
    from?: string;
    to?: string;
    timezone?: string;
  },
  defaultValues: StatsFilters,
): StatsFilters {
  const { from, to, timezone } = searchParams;

  return {
    from: from ?? defaultValues.from,
    to: to ?? defaultValues.to,
    timezone: timezone ? timezone : defaultValues.timezone,
  };
}
