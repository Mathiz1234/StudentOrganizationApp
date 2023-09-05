import { Algorithm } from 'jsonwebtoken';

import { Injectable } from '@nestjs/common';
import { ConfigService as ConfigServiceBase } from '@nestjs/config';

import { Config } from './config.enum';

@Injectable()
export class ConfigService extends ConfigServiceBase {
  constructor() {
    super();
  }

  /** SERVER */

  get serverUrl(): string {
    return process.env[Config.SERVER_URL];
  }

  /** DATABASE */

  get dbName(): string {
    return process.env[Config.DB_DATABASE];
  }

  get dbUser(): string {
    return process.env[Config.DB_USERNAME];
  }

  get dbPassword(): string {
    return process.env[Config.DB_PASSWORD];
  }

  get dbHost(): string {
    return process.env[Config.DB_HOST];
  }

  get dbPort(): number {
    return Number(process.env[Config.DB_PORT]);
  }

  get dbSchema(): string {
    return process.env[Config.DB_SCHEMA];
  }

  /** CRYPTO */

  get publicCryptoAlgorithm(): string {
    return process.env[Config.PUBLIC_CRYPTO_ALGORITHM];
  }

  get publicCryptoKey(): string {
    return process.env[Config.PUBLIC_CRYPTO_KEY];
  }

  /** JWT */

  get apiKey(): string {
    return process.env[Config.API_KEY];
  }

  get jwtAlgorithm(): Algorithm {
    return process.env[Config.JWT_ALGORITHM] as Algorithm;
  }

  get jwtIdTokenSecret(): string {
    return process.env[Config.JWT_ID_TOKEN_SECRET];
  }

  get jwtIdTokenExpTime(): number {
    return Number(process.env[Config.JWT_ID_TOKEN_EXP_TIME]);
  }

  get jwtRefreshTokenSecret(): string {
    return process.env[Config.JWT_REFRESH_TOKEN_SECRET];
  }

  get jwtRefreshTokenExpTime(): number {
    return Number(process.env[Config.JWT_REFRESH_TOKEN_EXP_TIME]);
  }

  /** GOOGLE */

  get googleClientId(): string {
    return process.env[Config.GOOGLE_CLIENT_ID];
  }

  get googleClientSecret(): string {
    return process.env[Config.GOOGLE_CLIENT_SECRET];
  }

  get googleRedirectUrl(): string {
    return process.env[Config.GOOGLE_REDIRECT_URL];
  }
}
