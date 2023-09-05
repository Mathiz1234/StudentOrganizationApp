import { ApiKeyGuard } from 'src/modules/auth/guards';
import { CannotAuthorizeException } from 'src/modules/exceptions/errors';

import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

import { HeaderName } from '../../enums';
import { ApiException } from '../exceptions/api-exception.decorator';

export const XApiKeyHeader = () =>
  applyDecorators(
    UseGuards(ApiKeyGuard),
    ApiHeader({
      name: HeaderName.XApiKey,
      required: true,
      description: 'Api key used for authorization.',
    }),
    ApiException(() => CannotAuthorizeException, {
      description: 'The provided api key is invalid.',
    }),
  );
