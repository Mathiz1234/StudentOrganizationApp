import { Account, Training } from 'src/database/entities';
import { DataSource } from 'typeorm';

import { Module } from '@nestjs/common';

import { TrainingsController } from './trainings.controller';
import { TrainingsService } from './trainings.service';

const services = [TrainingsService];

@Module({
  imports: [],
  providers: [
    {
      provide: 'TRAINING_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(Training),
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
  controllers: [TrainingsController],
})
export class TrainingsModule {}
