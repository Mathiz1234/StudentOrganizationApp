import { JwtGuard } from 'src/modules/auth/guards';
import { AccountNotFoundException } from 'src/modules/exceptions/errors';

import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { ApiException } from '../exceptions/api-exception.decorator';

export const CheckJwt = () =>
  applyDecorators(
    UseGuards(JwtGuard),
    ApiBearerAuth(),
    ApiException(() => AccountNotFoundException, {
      description: 'Bad sub claim in jwt payload.',
    }),
  );
