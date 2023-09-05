import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

import { BaseEntity } from './base.entity';

export abstract class BaseTimestampEntity extends BaseEntity {
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
