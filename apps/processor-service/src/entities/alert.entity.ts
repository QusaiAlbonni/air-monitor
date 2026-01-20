import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('alerts')
export class AlertEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  city: string;

  @Column('int')
  aqi: number;

  @Column()
  category: string;

  @Column({ type: 'timestamptz' })
  timestamp: Date;
}
