import { IEvent } from "./interfaces/event";

export abstract class EventBus {
  abstract publish(event: IEvent | IEvent[]): void;
}