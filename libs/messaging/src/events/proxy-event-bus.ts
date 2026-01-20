import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { EventBus } from './event-bus';
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

  publish(event: IEvent | IEvent[]): void {
    if (!Array.isArray(event)) {
      const metadata = this.getEventMetaData(event);
      this.client.emit(metadata.name, event);
      return;
    }
    event.forEach((e: IEvent) => {
      const metadata = this.getEventMetaData(e);
      this.client.emit(metadata.name, e);
    });
  }

  private getEventMetaData(event: IEvent): EventMetaData {
    const metadata = getEventMetadata(event);
    if (!metadata) throw new EventBlueprintNotFound();
    return metadata;
  }
}
