import { Project } from 'src/database/entities';
import { Deadline } from 'src/database/entities/deadline.entity';
import { DataSource } from 'typeorm';

import { Module } from '@nestjs/common';

import { DeadlinesController } from './deadlines.controller';
import { DeadlinesService } from './deadlines.service';

const services = [DeadlinesService];

@Module({
  imports: [],
  providers: [
    {
      provide: 'DEADLINE_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(Deadline),
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
  controllers: [DeadlinesController],
})
export class DeadlinesModule {}
