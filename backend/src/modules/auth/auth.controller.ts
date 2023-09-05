import { Account } from 'src/database/entities';

import { Body, Controller, Get, HttpCode, HttpStatus, Ip, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import {
    AccountNotFoundException, GoogleAccountNotVerifiedException, GoogleTokenInvalidException
} from '../exceptions/errors';
import {
    ApiException, CheckJwt, CheckJwtRefresh, GetAccount, UserAgentHeader, XApiKeyHeader
} from '../shared/decorators';
import { ApiTagName } from '../shared/enums';
import { JwtTokensResponseDto, LoginDto, MeResponseDto } from './dtos';
import { AuthService } from './services';

@Controller({ path: 'auth/', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Login or register with google.
   */
  @XApiKeyHeader()
  @Post('login')
  @ApiException(() => [
    AccountNotFoundException,
    GoogleAccountNotVerifiedException,
    GoogleTokenInvalidException,
  ])
  @HttpCode(HttpStatus.OK)
  @ApiTags(ApiTagName.AuthPublic)
  loginByGoogle(
    @Body() dto: LoginDto,
    @Ip() ip: string,
    @UserAgentHeader() userAgent: string,
  ): Promise<JwtTokensResponseDto> {
    return this.authService.login(dto, ip, userAgent);
  }

  /**
   * Logout customer or business user.
   */
  @CheckJwt()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiTags(ApiTagName.Auth)
  logout(@GetAccount() currentAccount: Account): Promise<void> {
    return this.authService.logout(currentAccount);
  }

  /**
   * Get new access token. In authorization header pass "Bearer refresh_token".
   */
  @CheckJwtRefresh()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiTags(ApiTagName.Auth)
  refreshTokens(
    @GetAccount() currentAccount: Account,
  ): Promise<JwtTokensResponseDto> {
    return this.authService.refreshTokens(currentAccount);
  }

  /**
   * Get info about logged user.
   */
  @CheckJwt()
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiTags(ApiTagName.Auth)
  me(@GetAccount() currentAccount: Account): MeResponseDto {
    return this.authService.getCurrentAccount(currentAccount);
  }
}
