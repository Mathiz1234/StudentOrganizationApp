import { ForbiddenException, NotFoundException } from '@nestjs/common';

export class AccountNotFoundException extends NotFoundException {
  constructor() {
    super('Cannot find account with given id.');
  }
}

export class AccountForbiddenException extends ForbiddenException {
  constructor() {
    super('Dont have access to account.');
  }
}

export class AccountSetAdminRoleForbiddenException extends ForbiddenException {
  constructor() {
    super('Only admins can set users role to admin');
  }
}

export class AccountDeleteAdminRoleForbiddenException extends ForbiddenException {
  constructor() {
    super('Only admins can delete admins');
  }
}
