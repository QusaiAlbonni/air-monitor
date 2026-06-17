import {
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  VersionColumn,
} from 'typeorm';

export enum EventState {
  UNSENT = 'unsent',
  IN_PROGRESS = 'in_progress',
  SENT = 'sent',
  FAILED = 'failed',
}

@Entity({ name: 'outbox_events' })
export class OutBoxEvent {
  @PrimaryColumn()
  id!: string;

  @Column()
  eventType!: string;

  @Column({ type: 'enum', enum: EventState })
  state: EventState = EventState.UNSENT;

  @Column()
  retries: number = 0;

  @Column({ type: 'jsonb' })
  data!: Record<string, any>;

  @Column({
    type: 'timestamptz',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;
}
