import { ICommandFactory } from '@air-monitor/messaging/events/event.factory';
import { Event } from '@air-monitor/messaging/events/interfaces/event';
import { ICommand } from '@nestjs/cqrs';
import { NewAirQualityAlertCommand } from '../new-air-alert.command';
import { AirQualityAlert } from '@air-monitor/air-quality/events/threshold-passed-alert.event';

export class NewAirQualityAlertCommandFactory implements ICommandFactory<AirQualityAlert> {
  createCommand(event: Event<AirQualityAlert>): ICommand {
    const { id, data } = event;
    return new NewAirQualityAlertCommand(id, data);
  }
}
