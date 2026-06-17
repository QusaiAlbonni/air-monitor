import { Injectable } from "@nestjs/common";
import { OutboxStore } from "./outbox.store";
import { IEvent } from "@air-monitor/messaging/events/interfaces/event";

@Injectable()
export class OutboxEventPublisher {
  constructor(private readonly store: OutboxStore){}
  async publishEvents(events: {id: string, event: IEvent}[]){
    await this.store.store(events);
  }
}