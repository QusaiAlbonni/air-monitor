import { EVENT_METADATA_KEY } from "../events-registry";
import { EventMetaData } from "../interfaces/event-metadata";

export function Event(metadata: EventMetaData) {
  return function <T extends { new(...args: any[]): {} }>(constructor: T) {
    Reflect.defineMetadata(EVENT_METADATA_KEY, metadata, constructor);
  };
}