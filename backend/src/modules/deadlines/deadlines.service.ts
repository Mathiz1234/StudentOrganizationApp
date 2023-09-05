import { isEmpty, isNotEmpty } from 'class-validator';
import { Account, Project } from 'src/database/entities';
import { Deadline } from 'src/database/entities/deadline.entity';
import { Role } from 'src/database/enums/role.enum';
import { Repository } from 'typeorm';

import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';

import {
    DeadlineFrobiddenException, DeadlineNotFoundException, ProjectNotFoundException
} from '../exceptions/errors';
import { ClassAdapterHelper } from '../shared/helpers';
import { DeadlineDto, GetDeadlineResponseDto, GetDeadlinesDto } from './dtos';

@Injectable()
export class DeadlinesService {
  constructor(
    @Inject('DEADLINE_REPOSITORY')
    private deadlinesRepository: Repository<Deadline>,
    @Inject('PROJECT_REPOSITORY')
    private projectsRepository: Repository<Project>,
    private readonly configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {}

  async getDeadlines(query: GetDeadlinesDto) {
    if (isNotEmpty(query.projectId)) {
      const projectFound = await this.projectsRepository.findOne({
        where: {
          id: query.projectId,
        },
      });

      if (isEmpty(projectFound)) throw new ProjectNotFoundException();
    }

    const deadlines = await this.deadlinesRepository.find({
      where: {
        type: query.type,
        projectId: query.projectId,
      },
      order: {
        ddl: 'ASC',
      },
    });

    deadlines.filter((deadline) => {
      return deadline.ddl <= new Date();
    });

    await this.deadlinesRepository.save(deadlines);

    return ClassAdapterHelper.adaptToManyClass(
      GetDeadlineResponseDto,
      deadlines,
    );
  }

  async addDeadline(dto: DeadlineDto, currentAccount: Account) {
    const projectFound = await this.projectsRepository.findOne({
      where: {
        id: dto.projectId,
      },
    });

    if (isEmpty(projectFound)) throw new ProjectNotFoundException();

    await this.deadlinesRepository.save({
      ...dto,
      createdBy: currentAccount,
      updatedBy: currentAccount,
    });
  }

  async updateDeadline(id: string, dto: DeadlineDto, currentAccount: Account) {
    const projectFound = await this.projectsRepository.findOne({
      where: {
        id: dto.projectId,
      },
    });

    if (isEmpty(projectFound)) throw new ProjectNotFoundException();

    const deadlineFound = await this.deadlinesRepository.findOne({
      where: {
        id,
      },
    });

    if (isEmpty(deadlineFound)) throw new DeadlineNotFoundException();

    if (
      currentAccount.role !== Role.ADMIN &&
      deadlineFound.createdById !== currentAccount.id
    )
      throw new DeadlineFrobiddenException();

    await this.deadlinesRepository.update(
      { id },
      {
        ...dto,
        updatedBy: currentAccount,
      },
    );
  }

  async deleteDeadline(id: string, currentAccount: Account) {
    const deadlineFound = await this.deadlinesRepository.findOne({
      where: {
        id,
      },
    });

    if (isEmpty(deadlineFound)) throw new DeadlineNotFoundException();

    if (
      currentAccount.role !== Role.ADMIN &&
      deadlineFound.createdById !== currentAccount.id
    )
      throw new DeadlineFrobiddenException();
    await this.deadlinesRepository.delete({ id });

    return deadlineFound.id;
  }
}
