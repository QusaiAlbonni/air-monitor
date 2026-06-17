import { EventBlueprintNotFound } from '@air-monitor/messaging/events/exceptions/event-not-found.exception';
import { IEvent } from '@air-monitor/messaging/events/interfaces/event';
import { EventMetaData } from '@air-monitor/messaging/events/interfaces/event-metadata';
import { getEventMetadata } from '@air-monitor/messaging/events/util';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventState, OutBoxEvent } from './entities/outbox.entity';
import { EntityManager, In, Repository } from 'typeorm';
import { OutboxEventFactory } from './event.factory';

@Injectable()
export class OutboxStore {
  constructor(
    @InjectRepository(OutBoxEvent)
    private readonly eventsRepo: Repository<OutBoxEvent>,
    private readonly factory: OutboxEventFactory,
  ) {}

  async store(events: { event: IEvent; id: string }[]) {
    const eventArray: OutBoxEvent[] = [];
    const existing = (await this.fetchExisting(events.map((e) => e.id))).map(
      (e) => e.id,
    );
    const existingSet = new Set(existing);
    const cleaned = events.filter((e) => !existingSet.has(e.id));
    for (const { event, id } of cleaned) {
      const metadata = this.getEventMetaData(event);
      const type = metadata.name;
      console.log(`Publishing event of type ${type} with payload:`, event);
      const e = this.factory.create(event, id, type);
      eventArray.push(e);
    }
    await this.eventsRepo.manager.transaction(async (em) => {
      await em.save(eventArray);
    });
  }

  async fetchExisting(ids: string[]) {
    return await this.eventsRepo.find({
      where: { id: In(ids) },
      select: ['id'],
    });
  }

  async fetchUnsent(limit: number, em: EntityManager) {
    const events = await em.query(
      `
    SELECT * FROM outbox_events
    WHERE state = 'unsent'
    ORDER BY created_at ASC
    LIMIT $1
    FOR UPDATE SKIP LOCKED
`,
      [limit],
    );

    return this.eventsRepo.create(events);
  }

  async markSent(event: OutBoxEvent, em: EntityManager) {
    event.state = EventState.SENT;
    return await em.save(event);
  }

  async markInProgress(event: OutBoxEvent, em: EntityManager) {
    event.state = EventState.IN_PROGRESS;
    return await em.save(event);
  }

  async markManyInProgress(events: OutBoxEvent[], em: EntityManager) {
    for (const event of events) {
      event.state = EventState.IN_PROGRESS;
    }
    em.save(events);
  }

  async markFailed(event: OutBoxEvent, em: EntityManager) {
    event.state = EventState.FAILED;
    return await em.save(event);
  }

  async incrementRetries(event: OutBoxEvent, em: EntityManager) {
    event.retries++;
    return await em.save(event);
  }

  private getEventMetaData(event: IEvent): EventMetaData {
    const metadata = getEventMetadata(event);
    if (!metadata) throw new EventBlueprintNotFound();
    return metadata;
  }
}
