import { isEmpty, isNotEmpty } from 'class-validator';
import { Account, Training } from 'src/database/entities';
import { Repository } from 'typeorm';

import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { AccountNotFoundException } from '../exceptions/errors';
import {
    TrainingAlreadyExistsException, TrainingAssignToAccountNotFoundException,
    TrainingCannotDeleteWithAccountxception, TrainingNotFoundException
} from '../exceptions/errors/trainings.errors';
import { ClassAdapterHelper } from '../shared/helpers/mapping.helper';
import {
    AssignTrainingDto, GetTrainingResponseDto, TrainingDto, UnassignTrainingDto
} from './dtos';

@Injectable()
export class TrainingsService {
  constructor(
    @Inject('TRAINING_REPOSITORY')
    private trainingsRepository: Repository<Training>,
    @Inject('ACCOUNT_REPOSITORY')
    private accountsRepository: Repository<Account>,
    private readonly configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {}

  async getTrainings() {
    const trainings = await this.trainingsRepository.find({
      order: {
        name: 'ASC',
      },
    });

    return ClassAdapterHelper.adaptToManyClass(
      GetTrainingResponseDto,
      trainings,
    );
  }

  async addTraining(dto: TrainingDto, currentAccount: Account) {
    const training = await this.trainingsRepository.findOne({
      where: {
        name: dto.name,
      },
    });

    if (isNotEmpty(training)) throw new TrainingAlreadyExistsException();

    await this.trainingsRepository.save({
      ...dto,
      createdBy: currentAccount,
      updatedBy: currentAccount,
    });
  }

  async updateTraining(id: string, dto: TrainingDto, currentAccount: Account) {
    const training = await this.trainingsRepository.findOne({
      where: {
        name: dto.name,
      },
    });

    if (isNotEmpty(training) && training.id !== id)
      throw new TrainingAlreadyExistsException();

    const trainingFound = await this.trainingsRepository.findOne({
      where: {
        id,
      },
    });

    if (isEmpty(trainingFound)) throw new TrainingNotFoundException();

    await this.trainingsRepository.update(
      { id },
      {
        ...dto,
        updatedBy: currentAccount,
      },
    );
  }

  async deleteTraining(id: string) {
    const trainingFound = await this.trainingsRepository.findOne({
      where: {
        id,
      },
    });

    if (isEmpty(trainingFound)) throw new TrainingNotFoundException();

    if ((await trainingFound.accounts).length > 0)
      throw new TrainingCannotDeleteWithAccountxception();

    await this.trainingsRepository.delete({ id });

    return trainingFound.id;
  }

  async assignToAccount(body: AssignTrainingDto) {
    const account = await this.accountsRepository.findOne({
      where: {
        id: body.accountId,
      },
    });

    if (isEmpty(account)) throw new AccountNotFoundException();

    const training = await this.trainingsRepository.findOne({
      where: {
        id: body.trainingId,
      },
    });

    if (isEmpty(training)) throw new TrainingNotFoundException();

    (await account.trainings).push(training);
    await this.accountsRepository.save(account);
  }

  async unassignFromAccount(body: UnassignTrainingDto) {
    const training = await this.trainingsRepository.findOne({
      where: {
        id: body.trainingId,
      },
    });

    if (isEmpty(training)) throw new TrainingNotFoundException();

    const account = await this.accountsRepository.findOne({
      where: {
        id: body.accountId,
      },
    });

    if (isEmpty(account)) throw new AccountNotFoundException();

    const foundToRemove = (await account.trainings).find(
      (tra) => tra.id === training.id,
    );

    if (isEmpty(foundToRemove))
      throw new TrainingAssignToAccountNotFoundException();

    account.trainings = Promise.resolve(
      (await account.trainings).filter((tra) => {
        return tra.id !== foundToRemove.id;
      }),
    );

    await this.accountsRepository.save(account);
  }
}
