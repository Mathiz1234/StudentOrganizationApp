import { isNotEmpty, isObject } from 'class-validator';
import { Request } from 'express';
import * as moment from 'moment';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { HttpExceptionPayload, ServerExceptionPayload } from './intefaces';

@Injectable()
export class ExceptionsService {
  constructor() {}

  private getMessageFromHttpException(
    exception: HttpException,
  ): string | string[] {
    const payload = exception.getResponse();
    return isObject(payload) && isNotEmpty((payload as any)?.message)
      ? (payload as any).message || (payload as any).message?.error
      : payload;
  }

  prepareHttpExceptionPayload(exception: HttpException): HttpExceptionPayload {
    return {
      statusCode: exception.getStatus(),
      message: this.getMessageFromHttpException(exception),
      errorName: exception.constructor.name,
    } as HttpExceptionPayload;
  }

  prepareUnhandledExceptionPayload(): HttpExceptionPayload {
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Something went wrong',
      errorName: 'Unhandled Exception',
    } as HttpExceptionPayload;
  }

  prepareServerExceptionPayload(
    exception: any,
    request: Request,
  ): ServerExceptionPayload {
    return {
      message: exception?.name,
      errorName: exception?.message,
      errorStack: exception?.stack,
      timestamp: moment().toISOString(),
      hostname: request.hostname,
      url: request.url,
      method: request.method,
      ip: request.ip,
      headers: request.headers,
      query: request.query,
      body: request.body,
      exception,
    } as ServerExceptionPayload;
  }
}
