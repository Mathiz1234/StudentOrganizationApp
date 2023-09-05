import { isEmpty } from 'class-validator';
import { Account } from 'src/database/entities';
import { Role } from 'src/database/enums/role.enum';
import { ConfigService } from 'src/modules/shared/services/config/config.service';
import { Repository } from 'typeorm';

import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

// eslint-disable-next-line prettier/prettier
import {
  AccountDeleteAdminRoleForbiddenException,
  AccountForbiddenException,
  AccountNotFoundException,
  AccountSetAdminRoleForbiddenException,
} from '../exceptions/errors';
import { ClassAdapterHelper } from '../shared/helpers';
// eslint-disable-next-line prettier/prettier
import {
  AccountResponseDto,
  AccountWithBirthdayCountResponseDto,
  AccountWithDetailsResponseDto,
  UpdateAccountDto,
  UpdateRoleAndStatusAccountDto,
} from './dtos';

@Injectable()
export class AccountsService {
  constructor(
    @Inject('ACCOUNT_REPOSITORY')
    private accountsRepository: Repository<Account>,
    private readonly configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {}

  async getAccount(id: string) {
    const account = await this.accountsRepository.findOneBy({
      id,
    });

    if (isEmpty(account)) throw new AccountNotFoundException();

    const functions = await account.functions;
    const trainings = await account.trainings;

    return ClassAdapterHelper.adaptToOneClass(AccountWithDetailsResponseDto, {
      ...account,
      functions,
      trainings,
    });
  }

  async getAccountsWithBirthdayCounts() {
    const accounts = await this.accountsRepository.find();

    const accountsWithBirtdayCount = accounts.map((account) => {
      if (isEmpty(account.birthday)) return undefined;
      const today = new Date();
      const bday = new Date(account.birthday);
      bday.setFullYear(today.getFullYear()); // set the same year to compare

      if (today.getTime() > bday.getTime())
        bday.setFullYear(bday.getFullYear() + 1);

      const diff = bday.getTime() - today.getTime();
      const birthdayCount = Math.floor(diff / (1000 * 60 * 60 * 24));

      return { ...account, birthdayCount };
    });

    accountsWithBirtdayCount.sort(
      ({ birthdayCount: a }, { birthdayCount: b }) => a - b,
    );

    return ClassAdapterHelper.adaptToManyClass(
      AccountWithBirthdayCountResponseDto,
      accountsWithBirtdayCount,
    );
  }

  async getAccounts() {
    const accounts = await this.accountsRepository.find();

    return ClassAdapterHelper.adaptToManyClass(AccountResponseDto, accounts);
  }

  async updateAccount(
    id: string,
    dto: UpdateAccountDto,
    currentAccount: Account,
  ) {
    const account = await this.accountsRepository.findOneBy({
      id,
    });

    if (isEmpty(account)) throw new AccountNotFoundException();

    if (currentAccount.id !== account.id && currentAccount.role === Role.USER)
      throw new AccountForbiddenException();

    await this.accountsRepository.update(
      {
        id,
      },
      {
        ...dto,
        updatedBy: currentAccount,
      },
    );
  }

  async updateAccountRoleAndStatus(
    id: string,
    dto: UpdateRoleAndStatusAccountDto,
    currentAccount: Account,
  ) {
    const account = await this.accountsRepository.findOneBy({
      id,
    });

    if (isEmpty(account)) throw new AccountNotFoundException();

    if (currentAccount.role !== Role.ADMIN && dto.role === Role.ADMIN)
      throw new AccountSetAdminRoleForbiddenException();

    await this.accountsRepository.update(
      {
        id,
      },
      {
        ...dto,
        updatedBy: currentAccount,
      },
    );
  }

  async deleteAccount(id: string, currentAccount: Account) {
    const account = await this.accountsRepository.findOneBy({
      id,
    });

    if (isEmpty(account)) throw new AccountNotFoundException();

    if (currentAccount.role !== Role.ADMIN && account.role === Role.ADMIN)
      throw new AccountDeleteAdminRoleForbiddenException();

    await this.accountsRepository.delete({
      id,
    });
  }
}
