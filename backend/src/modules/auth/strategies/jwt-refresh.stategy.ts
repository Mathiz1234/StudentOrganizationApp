import { isEmpty } from 'class-validator';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Account } from 'src/database/entities';
import { AccountNotFoundException, CannotAuthorizeException } from 'src/modules/exceptions/errors';
import { StrategyName } from 'src/modules/shared/enums';
import { ConfigService } from 'src/modules/shared/services/config/config.service';
import { PrivateCryptoService } from 'src/modules/shared/services/crypto';
import { Repository } from 'typeorm';

import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { AuthService } from '../services/auth.service';
import { JwtPayload } from '../types';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  StrategyName.JwtRefresh,
) {
  constructor(
    @Inject('ACCOUNT_REPOSITORY')
    private accountsRepository: Repository<Account>,
    private readonly authService: AuthService,
    private readonly configServce: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configServce.jwtRefreshTokenSecret,
      issuer: configServce.serverUrl,
      audience: configServce.serverUrl,
      algorithms: configServce.jwtAlgorithm,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const refreshToken = req.get('authorization').replace('Bearer', '').trim();

    const account = await this.accountsRepository.findOne({
      where: {
        id: payload.sub,
      },
    });

    if (isEmpty(account)) throw new AccountNotFoundException();

    const refreshTokenHash = await PrivateCryptoService.generateTokenHash(
      refreshToken,
      account.refreshTokenSalt,
    );

    if (refreshTokenHash === account.refreshTokenHash) return account;

    this.authService.logout(account);
    throw new CannotAuthorizeException();
  }
}
