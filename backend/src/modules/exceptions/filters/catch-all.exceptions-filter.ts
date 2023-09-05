import { Request, Response } from 'express';
import * as moment from 'moment';

import {
    ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger
} from '@nestjs/common';

import { ExceptionsService } from '../exceptions.service';
import { HttpExceptionPayload } from '../intefaces';

@Catch()
export class CatchAllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(CatchAllExceptionsFilter.name);

  constructor(private readonly exceptionHandler: ExceptionsService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const validException = this.transformException(exception);

    if (validException.statusCode === HttpStatus.INTERNAL_SERVER_ERROR)
      this.logger.error(
        this.exceptionHandler.prepareServerExceptionPayload(exception, request),
      );

    return response.status(validException.statusCode).json({
      ...validException,
      path: request.url,
      timestamp: moment().toISOString(),
    });
  }

  private transformException(exception: unknown): HttpExceptionPayload {
    if (exception instanceof HttpException)
      return this.exceptionHandler.prepareHttpExceptionPayload(exception);

    return this.exceptionHandler.prepareUnhandledExceptionPayload();
  }
}
