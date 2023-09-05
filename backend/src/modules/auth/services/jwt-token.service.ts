import { ConfigService } from 'src/modules/shared/services/config/config.service';

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { JwtAuthTokens, JwtPayload } from '../types';

@Injectable()
export class JwTTokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  public async generateAccessToken(
    payload: Partial<JwtPayload>,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.jwtIdTokenSecret,
      expiresIn: this.configService.jwtIdTokenExpTime,
    });
  }

  public async generateRefreshToken(
    payload: Partial<JwtPayload>,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.jwtRefreshTokenSecret,
      expiresIn: this.configService.jwtRefreshTokenExpTime,
    });
  }

  public async getAuthTokens(
    payload: Partial<JwtPayload>,
  ): Promise<JwtAuthTokens> {
    return {
      access_token: await this.generateAccessToken(payload),
      refresh_token: await this.generateRefreshToken(payload),
    };
  }
}
