import { Injectable } from '@nestjs/common';
import { OutboxStore } from './outbox.store';
import { EventBus } from '@air-monitor/messaging/events/event-bus';
import { Interval } from '@nestjs/schedule';
import { EntityManager } from 'typeorm';

@Injectable()
export class OutboxProducer {
  constructor(
    private eventStore: OutboxStore,
    private eventBus: EventBus,
    private readonly em: EntityManager,
  ) {}

  @Interval(5000)
  async produceEvents() {
    const events = await this.em.transaction(async (em) => {
      const records = await this.eventStore.fetchUnsent(50, em);
      if (records.length > 0)
        await this.eventStore.markManyInProgress(records, em);
      return records;
    });

    for (const event of events) {
      try {
        await this.eventBus.publish({
          id: event.id,
          type: event.eventType,
          data: event.data,
        });
        await this.eventStore.markSent(event, this.em);
      } catch (err) {
        console.error(`Event ${event.id} failed:`, err);
        if (event.retries < 3) {
          await this.eventStore.incrementRetries(event, this.em);
        } else {
          await this.eventStore.markFailed(event, this.em);
        }
      }
    }
  }
}
