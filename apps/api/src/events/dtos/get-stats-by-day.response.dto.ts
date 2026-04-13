export type GetStatsByDayResponse = {
  period: {
    from: string;
    to: string;
    timeZone: string;
  };
  eventsByDay: {
    date: string;
    count: number;
  }[];
};
