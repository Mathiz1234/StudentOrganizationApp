import { UnauthorizedException } from '@nestjs/common';

export class CannotAuthorizeException extends UnauthorizedException {
  constructor() {
    super('Cannot authorize.');
  }
}

export class GoogleAccountNotVerifiedException extends UnauthorizedException {
  constructor() {
    super('Your google acocunt is not verified.');
  }
}

export class GoogleTokenInvalidException extends UnauthorizedException {
  constructor() {
    super('Something went wrong with google token verification.');
  }
}

export class GoogleAccountNotFromBestGliwiceException extends UnauthorizedException {
  constructor() {
    super('Only members from BEST Gliwice have access.');
  }
}
