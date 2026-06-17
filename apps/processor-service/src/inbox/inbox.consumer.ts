import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Interval } from '@nestjs/schedule';
import { EntityManager } from 'typeorm';
import { InboxStore } from './inbox.store';
import { EventMetaData } from '@air-monitor/messaging/events/interfaces/event-metadata';
import {
  getCommandFactoryFromEventName,
  getEventMetadata,
} from '@air-monitor/messaging/events/util';
import { ICommandFactory } from '@air-monitor/messaging/events/event.factory';

@Injectable()
export class InboxConsumer {
  constructor(
    private readonly inboxStore: InboxStore,
    private readonly commandBus: CommandBus,
    private readonly em: EntityManager,
  ) {}

  @Interval(5000)
  async consumeEvents() {
    const records = await this.em.transaction(async (em) => {
      const events = await this.inboxStore.fetchReceived(50, em);
      if (events.length > 0) {
        await this.inboxStore.markManyInProgress(events, em);
      }
      return events;
    });

    if (records.length === 0) return;

    const processingPromises = records.map(async (record) => {
      try {
        const commandFactory: ICommandFactory<any> | undefined =
          getCommandFactoryFromEventName(record.eventType);

        if (!commandFactory) {
          throw new Error(
            `No command factory defined for event type: ${record.eventType}`,
          );
        }

        const command = commandFactory.createCommand({
          id: record.id,
          type: record.eventType,
          data: record.data,
        });

        await this.commandBus.execute(command);

        await this.inboxStore.markProcessed(record, this.em);
      } catch (err) {
        console.error(`Inbox event [${record.id}] failed processing:`, err);

        await this.inboxStore.markFailed(record, this.em);
      }
    });

    await Promise.allSettled(processingPromises);
  }
}
