export type GetStatsByTypeResponse = {
  total: number;
  types: {
    type: string;
    count: number;
  }[];
};
