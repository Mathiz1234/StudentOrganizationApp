import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TerminusModule } from '@nestjs/terminus';

import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { AuthModule } from './modules/auth/auth.module';
import { DeadlinesModule } from './modules/deadlines/deadlines.module';
import { ExceptionsModule } from './modules/exceptions/exceptions.module';
import { CatchAllExceptionsFilter } from './modules/exceptions/filters';
import {
    OrganizationFunctionsModule
} from './modules/organization-functions/organization-functions.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ConfigModule } from './modules/shared/services/config/config.module';
import { CryptoModule } from './modules/shared/services/crypto';
import { TrainingsModule } from './modules/trainings/trainings.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule,
    ExceptionsModule,
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '::',
    }),
    TerminusModule,
    HttpModule,
    CryptoModule,
    AuthModule,
    AccountsModule,
    ProjectsModule,
    OrganizationFunctionsModule,
    TrainingsModule,
    DeadlinesModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: CatchAllExceptionsFilter,
    },
  ],
})
export class AppModule {}
