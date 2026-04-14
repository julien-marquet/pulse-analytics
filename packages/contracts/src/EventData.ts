export type EventData = {
  type: string;
  emittedAt: Date;
  properties: Record<string, unknown>;
};
