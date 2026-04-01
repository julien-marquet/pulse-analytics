import { JsonObject } from 'packages/database/generated/runtime/client';

export type GetStatsByDayResponse = {
  eventType: string;
  count: number;
}[];

export type GetStatsByTypeResponse = {
  date: Date;
  count: number;
}[];

type EventResponseDto = {
  type: string;
  id: string;
  receivedAt: Date;
  processedAt: Date;
  properties: Record<string, any>;
};

export type GetEventsResponse = {
  page: number;
  pageSize: number;
  total: number;
  data: EventResponseDto[];
};
