import { EVENT_METADATA_KEY } from "./events-registry";
import { EventMetaData } from "./interfaces/event-metadata";

export function getEventMetadata(
  target: object | Function
): EventMetaData | undefined {
  const ctor =
    typeof target === 'function' ? target : target.constructor;

  return Reflect.getMetadata(EVENT_METADATA_KEY, ctor);
}