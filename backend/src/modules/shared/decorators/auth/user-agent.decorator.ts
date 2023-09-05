import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { HeaderName } from '../../enums';

export const UserAgentHeader = createParamDecorator((_, ctx: ExecutionContext): string => {
  const req = ctx.switchToHttp().getRequest();
  return req.headers[HeaderName.UserAgent];
});
