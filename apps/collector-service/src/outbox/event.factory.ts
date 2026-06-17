import { IEvent } from "@air-monitor/messaging/events/interfaces/event";
import { Injectable } from "@nestjs/common";
import { OutBoxEvent } from "./entities/outbox.entity";

@Injectable()
export class OutboxEventFactory {
  create(event: IEvent, id: string, eventType: string){
    const eventEntity = new OutBoxEvent();
    eventEntity.data = event;
    eventEntity.eventType = eventType;
    eventEntity.id = id;
    return eventEntity;
  }
}