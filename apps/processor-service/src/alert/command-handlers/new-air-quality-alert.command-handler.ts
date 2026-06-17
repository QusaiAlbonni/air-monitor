import { NewAirQualityAlertCommand } from '@air-monitor/air-quality/commands/new-air-alert.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AlertService } from '../services/alert.service';
import { InjectLogger } from '@air-monitor/core/logging/logging.decorator';
import { Logger } from 'winston';
import { mapToAirQualityAlertPayload } from '@air-monitor/air-quality/logging/mappers/air-quality-event.mapper';
import { AlertsGateway } from '../gateways/alerts.gateway';

@CommandHandler(NewAirQualityAlertCommand)
export class NewAirQualityAlertCommandHandler implements ICommandHandler<NewAirQualityAlertCommand> {
  constructor(
    private readonly service: AlertService,
    @InjectLogger() private readonly logger: Logger,
    private readonly gateway: AlertsGateway,
  ) {}

  async execute(command: NewAirQualityAlertCommand): Promise<any> {
    const exists = await this.service.exists(command.idempotencyKey);

    //drop
    if (exists) {
      return;
    }

    this.logger.warn('Critical air quality detected', {
      airQualityPayload: mapToAirQualityAlertPayload(command.alert),
    });

    await this.service.save(command.alert, command.idempotencyKey);
    this.gateway.onAlert(command.alert);
  }
}
