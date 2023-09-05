import { Account, AccountFunction, Project } from 'src/database/entities';
import { OrganizationFunction } from 'src/database/entities/organization-function.entity';
import { DataSource } from 'typeorm';

import { Module } from '@nestjs/common';

import { OrganizationFunctionsontroller } from './organization-functions.controller';
import { OrganizationFunctionsService } from './organization-functions.service';

const services = [OrganizationFunctionsService];

@Module({
  imports: [],
  providers: [
    {
      provide: 'ORGANIZATION_FUNCTION_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(OrganizationFunction),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'ACCOUNT_FUNCTION_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(AccountFunction),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'ACCOUNT_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Account),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'PROJECT_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Project),
      inject: ['DATA_SOURCE'],
    },
    ...services,
  ],
  exports: [],
  controllers: [OrganizationFunctionsontroller],
})
export class OrganizationFunctionsModule {}
