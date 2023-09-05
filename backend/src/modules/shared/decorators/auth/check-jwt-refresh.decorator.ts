import { JwtRefreshGuard } from 'src/modules/auth/guards';
import { CannotAuthorizeException } from 'src/modules/exceptions/errors';

import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { ApiException } from '../exceptions/api-exception.decorator';

export const CheckJwtRefresh = () =>
  applyDecorators(
    UseGuards(JwtRefreshGuard),
    ApiBearerAuth(),
    ApiException(() => CannotAuthorizeException, {
      description:
        'The provided refresh token does not match the token in the database',
    }),
  );
