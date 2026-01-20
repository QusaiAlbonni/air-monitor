import { EventPattern } from '@nestjs/microservices';
import { getEventMetadata } from '../util';
import { EventBlueprintNotFound } from '../exceptions/event-not-found.exception';

export function HandleEvent(klass: Function) {
  const metadata = getEventMetadata(klass);
  if (!metadata?.name) {
    throw new EventBlueprintNotFound();
  }
  return EventPattern(metadata.name);
}
