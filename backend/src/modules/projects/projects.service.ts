import { isEmpty, isNotEmpty } from 'class-validator';
import { Account, AccountFunction } from 'src/database/entities';
import { OrganizationFunction } from 'src/database/entities/organization-function.entity';
import { Project } from 'src/database/entities/project.entity';
import { Repository } from 'typeorm';

import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';

import {
    ProjectAlreadyExistsException, ProjectCannotDeleteWithDeadlinesException,
    ProjectCannotDeleteWithFunciontsException, ProjectNotFoundException
} from '../exceptions/errors';
import { ClassAdapterHelper } from '../shared/helpers';
import {
    GetProjectCTDto, GetProjectCTResponseDto, GetProjectDetailsResponseDto, GetProjectDto,
    ProjectDto
} from './dtos';

@Injectable()
export class ProjectsService {
  constructor(
    @Inject('PROJECT_REPOSITORY')
    private projectsRepository: Repository<Project>,
    @Inject('ACCOUNT_FUNCTION_REPOSITORY')
    private accountFunctionsRepository: Repository<AccountFunction>,
    @Inject('ACCOUNT_REPOSITORY')
    private accountsRepository: Repository<Account>,
    private readonly configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {}

  async getProjects() {
    const projectsFound = await this.projectsRepository.find({
      order: {
        name: 'ASC',
      },
    });

    const projects = await Promise.all(
      projectsFound.map(async (project) => {
        const yearsFound = await this.accountFunctionsRepository.find({
          select: {
            year: true,
          },
          where: {
            organizationFunction: {
              projectId: project.id,
            },
          },
          order: {
            year: 'DESC',
          },
        });

        const years = [...new Set(yearsFound.map((year) => year.year))];

        return {
          project: project,
          years: years,
        };
      }),
    );

    return ClassAdapterHelper.adaptToManyClass(
      GetProjectDetailsResponseDto,
      projects,
    );
  }

  async getProjectCT(dto: GetProjectDto, query: GetProjectCTDto) {
    const accounts = await this.accountsRepository
      .createQueryBuilder('account')
      .innerJoin('account.functions', 'functions')
      .innerJoin('functions.organizationFunction', 'organizationFunction')
      .select('account.id', 'id')
      .addSelect('account.firstName', 'firstName')
      .addSelect('account.lastName', 'lastName')
      .addSelect('account.nick', 'nick')
      .addSelect((subQuery) => {
        return subQuery
          .select('innerOrganizationFunction.name', 'functionName')
          .andWhere('innerOrganizationFunction.id = organizationFunction.id')
          .from(OrganizationFunction, 'innerOrganizationFunction');
      }, 'functionName')
      .andWhere('functions.year = :year', { year: query.year })
      .andWhere('organizationFunction.projectId = :projectId', {
        projectId: dto.id,
      })
      .getRawMany();

    return ClassAdapterHelper.adaptToManyClass(
      GetProjectCTResponseDto,
      accounts,
    );
  }

  async addProject(dto: ProjectDto, currentAccount: Account) {
    const project = await this.projectsRepository.findOne({
      where: {
        name: dto.name,
      },
    });

    if (isNotEmpty(project)) throw new ProjectAlreadyExistsException();

    await this.projectsRepository.save({
      ...dto,
      createdBy: currentAccount,
      updatedBy: currentAccount,
    });
  }

  async updateProject(id: string, dto: ProjectDto, currentAccount: Account) {
    const project = await this.projectsRepository.findOne({
      where: {
        name: dto.name,
      },
    });

    if (isNotEmpty(project) && project.id !== id)
      throw new ProjectAlreadyExistsException();

    const projectFound = await this.projectsRepository.findOne({
      where: {
        id,
      },
    });

    if (isEmpty(projectFound)) throw new ProjectNotFoundException();

    await this.projectsRepository.update(
      { id },
      {
        ...dto,
        updatedBy: currentAccount,
      },
    );
  }

  async deleteProject(id: string) {
    const projectFound = await this.projectsRepository.findOne({
      where: {
        id,
      },
    });

    if (isEmpty(projectFound)) throw new ProjectNotFoundException();

    if ((await projectFound.functions).length > 0)
      throw new ProjectCannotDeleteWithFunciontsException();

    if ((await projectFound.deadlines).length > 0)
      throw new ProjectCannotDeleteWithDeadlinesException();

    await this.projectsRepository.delete({ id });

    return projectFound.id;
  }
}
