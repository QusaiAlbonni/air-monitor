import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { HandleEvent } from '@air-monitor/messaging/events/decorator/handle-event';
import { AirQualityAlert } from '@air-monitor/air-quality/events/threshold-passed-alert.event';
import { InjectLogger } from '@air-monitor/core/logging';
import { Logger } from 'winston';
import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { mapToAirQualityAlertPayload } from '@air-monitor/air-quality/logging/mappers/air-quality-event.mapper';
import { AlertService } from '../services/alert.service';
import { EventsGateway } from '../gateways/events.gateway';

@Controller()
export class AlertConsumer {
  constructor(
    @InjectLogger() private readonly logger: Logger,
    private readonly alertService: AlertService,
    private readonly gateway: EventsGateway
  ) {}

  @HandleEvent(AirQualityAlert)
  async handleAirQualityEvent(@Payload() data: AirQualityAlert) {
    const dto = plainToInstance(AirQualityAlert, data);
    try {
      await validateOrReject(dto);
    } catch (errors) {
      console.error('Validation failed', JSON.stringify(errors, null, 2));
      return;
    }
    //logs event
    this.logger.warn('Critical air quality detected', {
      airQualityPayload: mapToAirQualityAlertPayload(dto),
    });

    await this.alertService.save(dto);
    this.gateway.onAlert(dto);
  }
}
