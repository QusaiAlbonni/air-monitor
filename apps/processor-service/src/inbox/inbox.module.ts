import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InboxEvent } from './entities/inbox.entity';
import { InboxStore } from './inbox.store';
import { CqrsModule } from '@nestjs/cqrs';
import { ScheduleModule } from '@nestjs/schedule';
import { InboxConsumer } from './inbox.consumer';

@Module({
  imports: [TypeOrmModule.forFeature([InboxEvent]), CqrsModule, ScheduleModule],
  providers: [InboxStore, InboxConsumer],
  exports: [InboxStore],
})
export class InboxModule {}
