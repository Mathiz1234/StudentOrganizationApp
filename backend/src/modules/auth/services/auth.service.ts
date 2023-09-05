import { isEmpty } from 'class-validator';
import { Account } from 'src/database/entities';
import { ClassAdapterHelper } from 'src/modules/shared/helpers';
import { ConfigService } from 'src/modules/shared/services/config/config.service';
import { Repository } from 'typeorm';

import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { LoginDto, MeResponseDto } from '../dtos';
import { JwtAuthTokens, JwtPayload } from '../types';
import { JwTTokenService } from './jwt-token.service';
import { SocialMediaService } from './social-media.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('ACCOUNT_REPOSITORY')
    private accountsRepository: Repository<Account>,
    private readonly jwTTokenService: JwTTokenService,
    @Inject('GOOGLE_PROVIDER')
    private readonly googleService: SocialMediaService,
    private readonly configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {}

  private prepareTokenPayload(account: Account): Partial<JwtPayload> {
    return {
      sub: account.id,
      email: account.email,
    };
  }

  async login(
    { authorization_code }: LoginDto,
    ip: string,
    userAgent: string,
  ): Promise<JwtAuthTokens> {
    // const payload = await this.googleService.getOIDCData(authorization_code);
    // let account = await this.accountsRepository.findOne({
    //   where: {
    //     googleUserIdentifier: payload.sub,
    //   },
    // });

    let account = await this.accountsRepository.findOne({
      where: {
        id: authorization_code,
      },
    });

    // if (isEmpty(account)) {
    //   account = await this.accountsRepository.manager.transaction(
    //     async (manager) => {
    //       const account = manager.create(Account, {
    //         firstName: payload.given_name,
    //         lastName: payload.family_name,
    //         email: payload.email,
    //         googleUserIdentifier: payload.sub,
    //       });

    //       account.createdBy = account;
    //       account.updatedBy = account;

    //       await manager.save(account);

    //       return account;
    //     },
    //   );
    // } else {
    //   account.firstName = payload.given_name;
    //   account.lastName = payload.family_name;
    //   account.email = payload.email;
    //   account.updatedBy = account;
    //   await this.accountsRepository.save(account);
    // }

    return this.getTokens(account);
  }

  async logout(currentAccount: Account): Promise<void> {
    currentAccount.refreshTokenHash = null;
    await this.accountsRepository.save(currentAccount);
  }

  async refreshTokens(currentAccount: Account): Promise<JwtAuthTokens> {
    return this.getTokens(currentAccount);
  }

  async getTokens(account: Account): Promise<JwtAuthTokens> {
    const payload = this.prepareTokenPayload(account);
    const tokens = await this.jwTTokenService.getAuthTokens(payload);

    account.refreshTokenHash = tokens.refresh_token;
    await this.accountsRepository.save(account);

    return tokens;
  }

  getCurrentAccount(currentAccount: Account): MeResponseDto {
    return ClassAdapterHelper.adaptToOneClass(MeResponseDto, currentAccount);
  }
}
