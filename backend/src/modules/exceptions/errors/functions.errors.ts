import { BadRequestException, NotFoundException } from '@nestjs/common';

export class FunctionAlreadyExistsException extends BadRequestException {
  constructor() {
    super('Function already exists.');
  }
}

export class FunctionCannotDeleteWithAccountException extends BadRequestException {
  constructor() {
    super('Cannot delete funtion with associate accounts.');
  }
}

export class FunctionNotFoundException extends NotFoundException {
  constructor() {
    super('Function not found.');
  }
}

export class AccountFunctionNotFoundException extends NotFoundException {
  constructor() {
    super('Function with year not found.');
  }
}

export class FunctionAssignToAccountNotFoundException extends NotFoundException {
  constructor() {
    super('Function with year assign to account not found.');
  }
}
