import { Event, IEvent } from './interfaces/event';

export abstract class EventBus {
  abstract publish<T extends IEvent>(event: Event<T> | Event<T>[]): void;
}
