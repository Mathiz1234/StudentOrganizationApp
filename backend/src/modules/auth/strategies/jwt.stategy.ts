import { isEmpty } from 'class-validator';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Account } from 'src/database/entities';
import { AccountNotFoundException } from 'src/modules/exceptions/errors';
import { StrategyName } from 'src/modules/shared/enums';
import { ConfigService } from 'src/modules/shared/services/config/config.service';
import { Repository } from 'typeorm';

import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, StrategyName.Jwt) {
  constructor(
    @Inject('ACCOUNT_REPOSITORY')
    private accountsRepository: Repository<Account>,
    private readonly configServce: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configServce.jwtIdTokenSecret,
      issuer: configServce.serverUrl,
      audience: configServce.serverUrl,
      algorithms: configServce.jwtAlgorithm,
      ignoreExpiration: false,
    });
  }

  public async validate(payload: any): Promise<Account> {
    const account = await this.accountsRepository.findOne({
      where: {
        id: payload.sub,
      },
    });

    if (isEmpty(account)) throw new AccountNotFoundException();

    return account;
  }
}
