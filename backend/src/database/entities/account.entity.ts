import { Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

import { Role } from '../enums/role.enum';
import { Status } from '../enums/status.enum';
import { TShirtSize } from '../enums/t-shirt-size.enum';
import { BaseTimestampEntity } from './abstract';
import { AccountFunction } from './account-function.entity';
import { Plebiscite } from './plebiscite.entity';
import { Training } from './training.entity';

@Entity()
@Index(['email'], { unique: true })
export class Account extends BaseTimestampEntity {
  @Column('varchar', { length: 256 })
  firstName!: string;

  @Column('varchar', { length: 256 })
  lastName!: string;

  @Column('varchar', { length: 256 })
  email!: string;

  @Column('text', {
    nullable: true,
  })
  nick: string;

  @Column('date', {
    nullable: true,
  })
  birthday: Date;

  @Column('varchar', { nullable: true, length: 256 })
  joined: string;

  @Column('varchar', { nullable: true, length: 256 })
  address: string;

  @Column('varchar', { nullable: true, length: 256 })
  city: string;

  @Column('varchar', { nullable: true, length: 256 })
  zipCode: string;

  @Column('varchar', { nullable: true, length: 15 })
  phoneNumber: string;

  @Column('varchar', { nullable: true, length: 256 })
  faculty: string;

  @Column('varchar', { nullable: true, length: 256 })
  fieldOfStudy: string;

  @Column('int', {
    nullable: true,
  })
  studyYear: number;

  @Column('int', {
    nullable: true,
  })
  studyGroup: number;

  @Column({
    type: 'enum',
    enum: TShirtSize,
    nullable: true,
  })
  tShirtSize: TShirtSize;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.BABY,
  })
  status: Status;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  /** RELATIONS */

  @ManyToMany(() => AccountFunction, (functions) => functions.accounts, {
    onDelete: 'RESTRICT',
    cascade: true,
  })
  @JoinTable()
  functions: Promise<AccountFunction[]>;

  @ManyToMany(() => Training, (training) => training.accounts, {
    onDelete: 'RESTRICT',
  })
  @JoinTable()
  trainings: Promise<Training[]>;

  @ManyToMany(() => Plebiscite)
  @JoinTable()
  plebiscites: Promise<Plebiscite[]>;

  /** PASSWORD AND TOKENS MANAGEMENT */

  @Column('varchar', { length: 64, nullable: true })
  refreshTokenHash: string;

  @Column('varchar', { length: 32 })
  refreshTokenSalt!: string;

  @Column('varchar', { nullable: true, default: null })
  googleUserIdentifier: string;

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
  account: AccountFunction[];
}
