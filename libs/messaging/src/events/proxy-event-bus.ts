import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { EventBus } from './event-bus';
import { Event } from './interfaces/event';
import { ClientProxy } from '@nestjs/microservices';
import { COLLECTOR_CLIENT_PROXY_TOKEN } from '../transport';
import { IEvent } from './interfaces/event';
import { EventMetaData } from './interfaces/event-metadata';
import { getEventMetadata } from './util';
import { EventBlueprintNotFound } from './exceptions/event-not-found.exception';

@Injectable()
export class ProxyEventBus implements EventBus, OnModuleInit {
  constructor(
    @Inject(COLLECTOR_CLIENT_PROXY_TOKEN) private readonly client: ClientProxy,
  ) {}

  async onModuleInit() {
    this.client.connect();
  }

  publish<E extends Event<any>>(event: E | E[]): void {
    if (!Array.isArray(event)) {
      let eventName: string | undefined;
      if (event.type) eventName = event.type;
      else {
        const metadata = this.getEventMetaData(event.data);
        eventName = metadata.name;
      }
      this.client.emit(eventName, event);
      return;
    }
    event.forEach((e: Event<any>) => {
      let eventName: string | undefined;
      if (e.type) eventName = e.type;
      else {
        const metadata = this.getEventMetaData(e.data);
        eventName = metadata.name;
      }
      this.client.emit(eventName, e);
    });
  }

  private getEventMetaData(event: IEvent): EventMetaData {
    const metadata = getEventMetadata(event);
    if (!metadata) throw new EventBlueprintNotFound();
    return metadata;
  }
}
