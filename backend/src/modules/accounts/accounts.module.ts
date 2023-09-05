import { Account } from 'src/database/entities';
import { DataSource } from 'typeorm';

import { Module } from '@nestjs/common';

import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';

const services = [AccountsService];

@Module({
  imports: [],
  providers: [
    {
      provide: 'ACCOUNT_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Account),
      inject: ['DATA_SOURCE'],
    },
    ...services,
  ],
  exports: [],
  controllers: [AccountsController],
})
export class AccountsModule {}
