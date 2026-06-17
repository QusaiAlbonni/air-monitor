import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { HandleEvent } from '@air-monitor/messaging/events/decorator/handle-event';
import { AirQualityAlert } from '@air-monitor/air-quality/events/threshold-passed-alert.event';
import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Event } from '@air-monitor/messaging/events/interfaces/event';
import { InboxConsumer } from '../../inbox/inbox.consumer';
import { InboxStore } from '../../inbox/inbox.store';

@Controller()
export class AlertConsumer {
  constructor(private readonly inboxStore: InboxStore) {}

  @HandleEvent(AirQualityAlert)
  async handleAirQualityEvent(@Payload() data: Event<AirQualityAlert>) {
    const dto = plainToInstance(AirQualityAlert, data.data);
    try {
      await validateOrReject(dto);
    } catch (errors) {
      console.error('Validation failed', JSON.stringify(errors, null, 2));
      return;
    }
    //logs event
    this.inboxStore.store([
      { id: data.id, data: data.data, eventType: data.type },
    ]);
  }
}
