export interface PublishEventDto {
  id: string;
  type: string;
  emittedAt: string;
  properties: Record<string, unknown>;
}
