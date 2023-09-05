import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { HeaderName } from '../../enums';

export const Ip = createParamDecorator((_, ctx: ExecutionContext): string => {
  const req = ctx.switchToHttp().getRequest();
  return (
    req.headers[HeaderName.XForwardedFor] ||
    req.ip ||
    req.connection.remoteAddress
  );
});
