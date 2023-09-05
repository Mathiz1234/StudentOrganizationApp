import { isEmpty, isNotEmpty } from 'class-validator';
import { Account, AccountFunction, Project } from 'src/database/entities';
import { OrganizationFunction } from 'src/database/entities/organization-function.entity';
import { Repository } from 'typeorm';

import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { AccountNotFoundException, ProjectNotFoundException } from '../exceptions/errors';
import {
    AccountFunctionNotFoundException, FunctionAlreadyExistsException,
    FunctionAssignToAccountNotFoundException, FunctionCannotDeleteWithAccountException,
    FunctionNotFoundException
} from '../exceptions/errors/functions.errors';
import { ClassAdapterHelper } from '../shared/helpers';
import { AssignFunctionDto, FunctionDto, GetFunctionResponseDto, UnassignFunctionDto } from './dto';

@Injectable()
export class OrganizationFunctionsService {
  constructor(
    @Inject('ORGANIZATION_FUNCTION_REPOSITORY')
    private funtionsRepository: Repository<OrganizationFunction>,
    @Inject('ACCOUNT_FUNCTION_REPOSITORY')
    private accountFunctionsRepository: Repository<AccountFunction>,
    @Inject('ACCOUNT_REPOSITORY')
    private accountRepository: Repository<Account>,
    @Inject('PROJECT_REPOSITORY')
    private projectsRepository: Repository<Project>,
    private readonly configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {}

  async getFunctions() {
    const functions = await this.funtionsRepository.find({
      order: {
        project: {
          name: 'ASC',
        },
      },
    });

    return ClassAdapterHelper.adaptToManyClass(
      GetFunctionResponseDto,
      functions,
    );
  }

  async addFunction(dto: FunctionDto, currentAccount: Account) {
    const func = await this.funtionsRepository.findOne({
      where: {
        name: dto.name,
        projectId: dto.projectId || null,
      },
    });

    if (isNotEmpty(func)) throw new FunctionAlreadyExistsException();

    if (dto.projectId) {
      const project = await this.projectsRepository.findOne({
        where: {
          id: dto.projectId,
        },
      });

      if (isEmpty(project)) throw new ProjectNotFoundException();
    }

    await this.funtionsRepository.save({
      ...dto,
      createdBy: currentAccount,
      updatedBy: currentAccount,
    });
  }

  async updateFunction(id: string, dto: FunctionDto, currentAccount: Account) {
    const func = await this.funtionsRepository.findOne({
      where: {
        name: dto.name,
        projectId: dto.projectId || null,
      },
    });

    if (isNotEmpty(func) && func.id !== id)
      throw new FunctionAlreadyExistsException();

    const funcFound = await this.funtionsRepository.findOne({
      where: {
        id,
      },
    });

    if (isEmpty(funcFound)) throw new FunctionNotFoundException();

    if (dto.projectId) {
      const project = await this.projectsRepository.findOne({
        where: {
          id: dto.projectId,
        },
      });

      if (isEmpty(project)) throw new ProjectNotFoundException();
    }

    await this.funtionsRepository.update(
      { id },
      {
        ...dto,
        updatedBy: currentAccount,
      },
    );
  }

  async deleteFunction(id: string) {
    const funcFound = await this.funtionsRepository.findOne({
      where: {
        id,
      },
    });

    if (isEmpty(funcFound)) throw new FunctionNotFoundException();

    for (const func of await funcFound.accountFunctions) {
      const account = await this.accountRepository.find({
        where: {
          functions: {
            id: func.id,
          },
        },
      });
      if (account.length > 0)
        throw new FunctionCannotDeleteWithAccountException();
    }

    await this.funtionsRepository.delete({ id });

    return funcFound.id;
  }

  async assignToAccount(body: AssignFunctionDto, currentAccount: Account) {
    const account = await this.accountRepository.findOne({
      where: {
        id: body.accountId,
      },
    });

    if (isEmpty(account)) throw new AccountNotFoundException();

    const func = await this.funtionsRepository.findOne({
      where: {
        id: body.funcId,
      },
    });

    if (isEmpty(func)) throw new FunctionNotFoundException();

    let accountFunc = await this.accountFunctionsRepository.findOne({
      where: {
        year: body.year,
        organizationFunctionId: func.id,
      },
    });

    if (isEmpty(accountFunc))
      accountFunc = await this.accountFunctionsRepository.save({
        year: body.year,
        organizationFunction: func,
        createdBy: currentAccount,
        updatedBy: currentAccount,
      });

    (await account.functions).push(accountFunc);
    await this.accountRepository.save(account);
  }

  async unassignFromAccount(body: UnassignFunctionDto) {
    const accountFunc = await this.accountFunctionsRepository.findOne({
      where: {
        id: body.accountFunctionId,
      },
    });

    if (isEmpty(accountFunc)) throw new AccountFunctionNotFoundException();

    const account = await this.accountRepository.findOne({
      where: {
        id: body.accountId,
      },
    });

    if (isEmpty(account)) throw new AccountNotFoundException();

    const foundToRemove = (await account.functions).find(
      (func) => func.id === accountFunc.id,
    );

    if (isEmpty(foundToRemove))
      throw new FunctionAssignToAccountNotFoundException();

    account.functions = Promise.resolve(
      (await account.functions).filter((func) => {
        return func.id !== foundToRemove.id;
      }),
    );

    await this.accountRepository.save(account);
  }
}
