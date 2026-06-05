import { toSearchParams } from '../utils';
import { ApiClient } from './api';

interface GetStatsOverviewParams {
  timeZone?: string;
  from: string;
  to: string;
  nSelectedTopEvents?: number;
}

interface GetStatsOverviewResponse {
  period: {
    from: string;
    to: string;
    timeZone: string;
  };
  totalEvents: number;
  averageProcessingLatencyMs: number | null;
  eventTypesCount: number;
  topEventTypes: {
    eventType: string;
    count: number;
  }[];
  latestEventAt?: string;
}

interface GetStatsByDayParams {
  timeZone?: string;
  from: string;
  to: string;
}

interface GetStatsByDayResponse {
  period: {
    from: string;
    to: string;
    timeZone: string;
  };
  eventsByDay: {
    date: string;
    count: number;
    averageLatencyMs: number;
  }[];
}

export type EventResponseDto = {
  type: string;
  id: string;
  receivedAt: string;
  emittedAt: string;
  processedAt: string;
  properties: Record<string, unknown>;
  latencies: {
    ingestionLatencyMs: number;
    processingLatencyMs: number;
    totalLatencyMs: number;
  };
};

type GetEventsResponse = {
  page: number;
  pageSize: number;
  total: number;
  data: EventResponseDto[];
};

export type GetEventsRequestParams = {
  page?: number;
  pageSize?: number;
  from?: string;
  to?: string;
  type?: string[];
  sortBy?: 'emittedAt' | 'type';
  sortAsc?: boolean;
};

type GetTypesResponse = {
  types: string[];
};

type GetTimezonesResponse = {
  timezones: string[];
};

export type GetStatsByDayTypeParams = {
  timeZone?: string;
  from: string;
  to: string;
};

type GetStatsByTypeResponse = {
  total: number;
  types: { eventType: string; count: number }[];
};
export class EventsApi {
  constructor(private client: ApiClient) {}

  getStatsOverview(params: GetStatsOverviewParams) {
    return this.client.get<GetStatsOverviewResponse>('/events/stats/overview', {
      params: toSearchParams(params),
    });
  }

  getStatsByDay(params: GetStatsByDayParams) {
    return this.client.get<GetStatsByDayResponse>('/events/stats/by-day', {
      params: toSearchParams(params),
    });
  }

  getStatsByType(params: GetStatsByDayTypeParams) {
    return this.client.get<GetStatsByTypeResponse>('/events/stats/by-type', {
      params: toSearchParams(params),
    });
  }

  getEvents(params: GetEventsRequestParams) {
    return this.client.get<GetEventsResponse>('/events', {
      params: toSearchParams(params),
    });
  }

  getTypes() {
    return this.client.get<GetTypesResponse>('/events/types');
  }

  getTimezones() {
    return this.client.get<GetTimezonesResponse>('/events/stats/timezones');
  }
}
