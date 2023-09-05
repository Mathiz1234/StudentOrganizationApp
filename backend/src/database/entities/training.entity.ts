import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

import { BaseTimestampEntity } from './abstract';
import { Account } from './account.entity';

@Entity()
export class Training extends BaseTimestampEntity {
  @Column('varchar', { length: 256 })
  name!: string;

  /** RELATIONS */

  @ManyToMany(() => Account, (account) => account.trainings)
  accounts: Promise<Account[]>;

  /** MANAGED BY RELATIONS */
  @ManyToOne(() => Account, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdById' })
  createdBy: Account;

  @Column('uuid', { nullable: true })
  createdById: string;

  @ManyToOne(() => Account, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'updatedById' })
  updatedBy: Account;

  @Column('uuid', { nullable: true })
  updatedById: string;
}
