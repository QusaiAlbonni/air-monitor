import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
import { InboxEvent, InboxEventState } from './entities/inbox.entity';

@Injectable()
export class InboxStore {
  constructor(
    @InjectRepository(InboxEvent)
    private readonly eventsRepo: Repository<InboxEvent>,
  ) {}

  /**
   * Deduplicates and stores incoming inbox events in a single transaction.
   */
  async store(
    events: { id: string; eventType: string; data: Record<string, any> }[],
  ) {
    const eventArray: InboxEvent[] = [];

    const existing = (await this.fetchExisting(events.map((e) => e.id))).map(
      (e) => e.id,
    );
    const existingSet = new Set(existing);

    const cleaned = events.filter((e) => !existingSet.has(e.id));

    for (const { id, eventType, data } of cleaned) {
      console.log(`Received incoming event [${id}] of type: ${eventType}`);

      const e = this.eventsRepo.create({
        id,
        eventType,
        data,
        state: InboxEventState.RECEIVED,
      });

      eventArray.push(e);
    }

    if (eventArray.length > 0) {
      await this.eventsRepo.manager.transaction(async (em) => {
        await em.save(eventArray);
      });
    }
  }

  async markManyInProgress(events: InboxEvent[], em: EntityManager) {
    for (const event of events) {
      event.state = InboxEventState.IN_PROGRESS;
    }
    await em.save(events);
  }

  /**
   * Helper to find existing event records for deduplication checks.
   */
  async fetchExisting(ids: string[]) {
    return await this.eventsRepo.find({
      where: { id: In(ids) },
      select: ['id'],
    });
  }

  /**
   * Fetches unprocessed ('received') events using a pessimistic lock
   * to ensure multiple consumers don't pick up the same event.
   */
  async fetchReceived(limit: number, em: EntityManager): Promise<InboxEvent[]> {
    const events = await em.query(
      `
      SELECT * FROM inbox_events
      WHERE state = 'received'
      ORDER BY created_at ASC
      LIMIT $1
      FOR UPDATE SKIP LOCKED
      `,
      [limit],
    );

    return this.eventsRepo.create(events);
  }

  /**
   * Marks an event as successfully processed.
   */
  async markProcessed(event: InboxEvent, em: EntityManager) {
    event.state = InboxEventState.PROCESSED;
    return await em.save(event);
  }

  /**
   * Marks an event as failed during processing.
   */
  async markFailed(event: InboxEvent, em: EntityManager) {
    event.state = InboxEventState.FAILED;
    return await em.save(event);
  }
}
