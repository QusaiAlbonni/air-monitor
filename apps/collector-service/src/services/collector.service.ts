import { Injectable } from '@nestjs/common';
import { EventBus } from '@air-monitor/messaging/events/event-bus';
import { AirQualityAlert } from '@air-monitor/air-quality/events/threshold-passed-alert.event';
import { ReadingValidator } from '../../../../libs/air-quality/src/validators/reading.validator';
import { AirQualityReading } from '@air-monitor/air-quality/dto/air-quality-reading.interface';

@Injectable()
export class CollectorService {
  constructor(
    private readonly eventBus: EventBus,
    private readonly validator: ReadingValidator,
  ) {}
  async collectAirQualityReadings(readings: AirQualityReading[]) {
    readings = readings.filter((r) => !this.validator.validate(r).valid);
    const events = readings.map((r) => new AirQualityAlert(r));
    await this.eventBus.publish(events);
  }
}
