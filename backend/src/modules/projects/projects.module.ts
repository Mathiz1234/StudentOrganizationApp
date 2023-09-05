import { Account, AccountFunction } from 'src/database/entities';
import { Project } from 'src/database/entities/project.entity';
import { DataSource } from 'typeorm';

import { Module } from '@nestjs/common';

import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

const services = [ProjectsService];

@Module({
  imports: [],
  providers: [
    {
      provide: 'PROJECT_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Project),
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
    ...services,
  ],
  exports: [],
  controllers: [ProjectsController],
})
export class ProjectsModule {}
