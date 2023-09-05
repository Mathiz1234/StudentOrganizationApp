import { Auth as GoogleAuth, google } from 'googleapis';
import {
    GoogleAccountNotFromBestGliwiceException, GoogleAccountNotVerifiedException,
    GoogleTokenInvalidException
} from 'src/modules/exceptions/errors';
import { BEST_GLIWICE_EMAIL_SUFIX } from 'src/modules/shared/constants';
import { ConfigService } from 'src/modules/shared/services/config/config.service';

import { Injectable, Logger } from '@nestjs/common';

import { SocialMediaService } from './social-media.service';

@Injectable()
export class GoogleService implements SocialMediaService {
  private googleOauthClient: GoogleAuth.OAuth2Client;
  private readonly logger = new Logger(GoogleService.name);

  constructor(private readonly configService: ConfigService) {
    this.googleOauthClient = new google.auth.OAuth2(
      this.configService.googleClientId,
      this.configService.googleClientSecret,
      // this.configService.googleRedirectUrl,
    );
  }

  async getOIDCData(code: string) {
    try {
      const {
        tokens: { id_token },
      } = await this.googleOauthClient.getToken(code);
      const ticket = await this.googleOauthClient.verifyIdToken({
        idToken: id_token,
      });
      const payload = ticket.getPayload();
      if (!payload.email_verified)
        throw new GoogleAccountNotVerifiedException();
      if (!payload.email.includes(BEST_GLIWICE_EMAIL_SUFIX))
        throw new GoogleAccountNotFromBestGliwiceException();
      return payload;
    } catch (err) {
      this.logger.error(err);
      throw new GoogleTokenInvalidException();
    }
  }
}
