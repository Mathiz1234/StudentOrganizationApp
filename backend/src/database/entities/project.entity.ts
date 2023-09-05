import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { BaseTimestampEntity } from './abstract';
import { Account } from './account.entity';
import { Deadline } from './deadline.entity';
import { OrganizationFunction } from './organization-function.entity';

@Entity()
@Index(['name'], { unique: true })
export class Project extends BaseTimestampEntity {
  @Column('varchar', { length: 256 })
  name!: string;

  /** RELATIONS */

  @OneToMany(() => OrganizationFunction, (func) => func.project)
  functions: Promise<OrganizationFunction[]>;

  @OneToMany(() => Deadline, (deadline) => deadline.project)
  deadlines: Promise<Deadline[]>;

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
