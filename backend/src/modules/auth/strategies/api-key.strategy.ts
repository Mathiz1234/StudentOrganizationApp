import Strategy from 'passport-headerapikey';
import { CannotAuthorizeException } from 'src/modules/exceptions/errors';
import { HeaderName, StrategyName } from 'src/modules/shared/enums';
import { ConfigService } from 'src/modules/shared/services/config/config.service';

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(
  Strategy,
  StrategyName.ApiKey,
) {
  constructor(private readonly configService: ConfigService) {
    super({ header: HeaderName.XApiKey }, false, (apiKey, done) => {
      return this.validate(apiKey, done);
    });
  }

  public validate(apiKey: string, done: (error: Error, data) => void) {
    if (this.configService.apiKey === apiKey) {
      done(null, true);
      return;
    }
    throw new CannotAuthorizeException();
  }
}
