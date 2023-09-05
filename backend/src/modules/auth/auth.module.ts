import { Account } from 'src/database/entities';
import { DataSource } from 'typeorm';

import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { ConfigService } from '../shared/services/config/config.service';
import { CryptoModule } from '../shared/services/crypto';
import { AuthController } from './auth.controller';
import { AuthService, GoogleService, JwTTokenService } from './services';
import { ApiKeyStrategy, JwtRefreshStrategy, JwtStrategy } from './strategies';

const services = [AuthService, JwTTokenService];

const listeners = [];

const strategies = [JwtStrategy, JwtRefreshStrategy, ApiKeyStrategy];
@Global()
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          signOptions: {
            algorithm: configService.jwtAlgorithm,
            issuer: configService.serverUrl,
            audience: configService.serverUrl,
          },
        };
      },
      inject: [ConfigService],
    }),
    CryptoModule,
    HttpModule,
  ],
  providers: [
    {
      provide: 'GOOGLE_PROVIDER',
      useClass: GoogleService,
    },
    {
      provide: 'ACCOUNT_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Account),
      inject: ['DATA_SOURCE'],
    },
    ...services,
    ...strategies,
    ...listeners,
  ],
  exports: [...services, ...strategies],
  controllers: [AuthController],
})
export class AuthModule {}
