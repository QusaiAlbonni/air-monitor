import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutboxStore } from './outbox.store';
import { OutboxEventFactory } from './event.factory';
import { EventBusInfrastructureModule } from './transport/event-bus.infrastructure.module';
import { OutBoxEvent } from './entities/outbox.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { OutboxProducer } from './event.producer';
import { OutboxEventPublisher } from './event.publiser';

@Module({
  imports: [
    TypeOrmModule.forFeature([OutBoxEvent]),
    EventBusInfrastructureModule,
    ScheduleModule,
  ],
  providers: [
    OutboxStore,
    OutboxEventFactory,
    OutboxProducer,
    OutboxEventPublisher,
  ],
  exports: [OutboxStore, OutboxEventPublisher],
})
export class OutboxModule {}
