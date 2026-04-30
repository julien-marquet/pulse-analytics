export type EventsFilters = {
  from: Date | null;
  to: Date | null;
  type: string[];
  page: number;
  pageSize: number;
};

export type EventsSortingParams = {
  sortBy: 'emittedAt' | 'type' | null;
  sortAsc: boolean | null;
};

export type EventsTableEntry = {
  id: string;
  type: string;
  emittedAt: string;
};
