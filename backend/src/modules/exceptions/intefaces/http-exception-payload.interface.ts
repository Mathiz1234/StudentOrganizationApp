import { HttpStatus } from '@nestjs/common';

export interface HttpExceptionPayload {
  statusCode: HttpStatus;
  message: string | string[];
  errorName: string;
}
