export const EventTypes = {
  PAGE_VIEWED: 'page-viewed',
  BUTTON_CLICKED: 'button-clicked',
} as const;
export type EventType = (typeof EventTypes)[keyof typeof EventTypes];
