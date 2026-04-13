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
  averageProcessingLatencyMs: number;
  eventTypesCount: number;
  topEventTypes: {
    eventType: string;
    count: number;
  }[];
  latestEventAt?: string;
}

export class EventsApi {
  constructor(private client: ApiClient) {}

  getStatsOverview(params: GetStatsOverviewParams) {
    return this.client.get<GetStatsOverviewResponse>('/events/stats/overview', {
      params: toSearchParams(params),
    });
  }
}
