export class EventBlueprintNotFound extends Error {
  constructor(msg?: string) {
    super(msg ?? 'Event Was not found, be sure it is properly registered.' );
  }
}
