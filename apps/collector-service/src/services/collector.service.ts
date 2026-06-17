import { Injectable } from '@nestjs/common';
import { EventBus } from '@air-monitor/messaging/events/event-bus';
import { AirQualityAlert } from '@air-monitor/air-quality/events/threshold-passed-alert.event';
import { ReadingValidator } from '../../../../libs/air-quality/src/validators/reading.validator';
import { AirQualityReading } from '@air-monitor/air-quality/dto/air-quality-reading.interface';
import { OutboxEventPublisher } from '../outbox/event.publiser';

@Injectable()
export class CollectorService {
  constructor(
    private readonly validator: ReadingValidator,
    private readonly eventPublisher: OutboxEventPublisher,
  ) {}
  async collectAirQualityReadings(readings: AirQualityReading[]) {
    readings = readings.filter((r) => !this.validator.validate(r).valid);
    const events = readings.map((r) => ({
      event: new AirQualityAlert(r),
      id: 'alert::' + r.city + '::' + r.dateTime,
    }));
    await this.eventPublisher.publishEvents(events);
  }
}
