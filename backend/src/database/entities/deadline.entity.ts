import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { DdlType } from '../enums/ddl-type.enum';
import { BaseTimestampEntity } from './abstract';
import { Account } from './account.entity';
import { Project } from './project.entity';

@Entity()
export class Deadline extends BaseTimestampEntity {
  @Column('text')
  description!: string;

  @Column('timestamp')
  ddl!: Date;

  @Column({
    type: 'enum',
    enum: DdlType,
  })
  type!: DdlType;

  /** RELATIONS */

  @ManyToOne(() => Project, (project) => project.deadlines, {
    onDelete: 'RESTRICT',
    eager: true,
  })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column('uuid', { nullable: true })
  projectId: string;

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
