export interface CreateEventDto {
  id: string;
  type: string;
  emittedAt: string;
  properties: Record<string, unknown>;
}
