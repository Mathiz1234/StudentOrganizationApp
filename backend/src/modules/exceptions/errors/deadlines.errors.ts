import { ForbiddenException, NotFoundException } from '@nestjs/common';

export class DeadlineNotFoundException extends NotFoundException {
  constructor() {
    super('Deadline not found.');
  }
}

export class DeadlineFrobiddenException extends ForbiddenException {
  constructor() {
    super('TYou can edit or delete that deadline.');
  }
}
