import { EventCandidate } from '@app/events-domain';

export const EVENT_PUBLISHER = Symbol('EventPublisher');

export interface EventPublisher {
  publish(candidate: EventCandidate): Promise<void>;
}
