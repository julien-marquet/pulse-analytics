export type EventFilters = {
  from: Date | null;
  to: Date | null;
  type: string[];
  page: number;
  pageSize: number;
};
