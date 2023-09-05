import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { BaseTimestampEntity } from './abstract';
import { AccountFunction } from './account-function.entity';
import { Account } from './account.entity';
import { Project } from './project.entity';

@Entity()
@Index(['name', 'projectId'], { unique: true })
export class OrganizationFunction extends BaseTimestampEntity {
  @Column('varchar', { length: 256 })
  name!: string;

  /** RELATIONS */

  @ManyToOne(() => Project, (project) => project.functions, {
    onDelete: 'RESTRICT',
    eager: true,
  })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column('uuid', { nullable: true })
  projectId: string;

  @OneToMany(() => AccountFunction, (func) => func.organizationFunction)
  accountFunctions: Promise<AccountFunction[]>;

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
