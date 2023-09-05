import {
  buildPlaceholder,
  buildTemplatedApiExceptionDecorator,
} from '@nanogiants/nestjs-swagger-api-exception-decorator';
import { HttpException } from '@nestjs/common';

export const ApiException = buildTemplatedApiExceptionDecorator(
  {
    statusCode: '$status',
    apiErrorCode: '$apiErrorCode',
    message: '$description',
    errorName: '$errorName',
    path: 'string',
    timestamp: '2022-09-12T09:11:32.499Z',
  },
  {
    placeholders: {
      errorName: buildPlaceholder(
        () => HttpException,
        (exception) => exception.name,
      ),
    },
  },
);
