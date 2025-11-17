import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ROW_STATUS } from '../../../@core/enums/common';

@Entity('events')
@Index(['eventName'])
@Index(['createdAt'])
@Index(['status'])
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, name: 'event_name' })
  eventName: string;

  @Column({ type: 'json', name: 'event_attributes' })
  eventAttributes: object;

  @Column({ type: 'json', name: 'profile_attributes' })
  profileAttributes: object;

  @Column({
    type: 'tinyint',
    default: ROW_STATUS.ACTIVE,
  })
  status: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
