export type EventsFilters = {
  from: Date | null;
  to: Date | null;
  type: string[];
  page: number;
  pageSize: number;
};
