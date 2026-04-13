import { toSearchParams } from '../utils';
import { ApiClient } from './api';

interface GetStatsOverviewParams {
  timeZone?: string;
  from: string;
  to: string;
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
  }[];
}

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
}
