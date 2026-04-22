export type GetStatsByTypeResponse = {
  total: number;
  types: {
    eventType: string;
    count: number;
  }[];
};
