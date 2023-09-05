import { Column, Entity, Index, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';

import { BaseTimestampEntity } from './abstract';
import { Account } from './account.entity';
import { OrganizationFunction } from './organization-function.entity';

@Entity()
@Index(['year', 'organizationFunctionId'], { unique: true })
export class AccountFunction extends BaseTimestampEntity {
  @Column('varchar', { length: 32 })
  year!: string;

  /** RELATIONS */

  @ManyToOne(
    () => OrganizationFunction,
    (organizationFunction) => organizationFunction.accountFunctions,
    {
      onDelete: 'CASCADE',
      eager: true,
    },
  )
  @JoinColumn({ name: 'organizationFunctionId' })
  organizationFunction: OrganizationFunction;

  @Column('uuid')
  organizationFunctionId: string;

  @ManyToMany(() => Account, (account) => account.functions)
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
