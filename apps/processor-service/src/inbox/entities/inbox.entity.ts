import { Column, Entity, PrimaryColumn } from 'typeorm';

export enum InboxEventState {
  RECEIVED = 'received',
  PROCESSED = 'processed',
  IN_PROGRESS = 'in_progress',
  FAILED = 'failed',
}

@Entity({ name: 'inbox_events' })
export class InboxEvent {
  @PrimaryColumn()
  id!: string;

  @Column({ name: 'state', type: 'enum', enum: InboxEventState })
  state!: InboxEventState;

  @Column()
  eventType!: string;

  @Column({ type: 'jsonb' })
  data!: Record<string, any>;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt!: Date;
}
