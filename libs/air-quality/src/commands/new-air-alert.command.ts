import { ICommand } from '@nestjs/cqrs';
import { AirQualityAlert } from '../events/threshold-passed-alert.event';

export class NewAirQualityAlertCommand implements ICommand {
  constructor(
    public readonly idempotencyKey: string,
    public readonly alert: AirQualityAlert,
  ) {}
}
