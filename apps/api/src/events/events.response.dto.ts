export type GetStatsByDayResponse = {
  eventType: string;
  count: number;
}[];

export type GetStatsByTypeResponse = {
  date: Date;
  count: number;
}[];
