import { BadRequestException, NotFoundException } from '@nestjs/common';

export class TrainingAlreadyExistsException extends BadRequestException {
  constructor() {
    super('Training already exists.');
  }
}

export class TrainingNotFoundException extends NotFoundException {
  constructor() {
    super('Training not found.');
  }
}

export class TrainingAssignToAccountNotFoundException extends NotFoundException {
  constructor() {
    super('Training assign to account not found.');
  }
}

export class TrainingCannotDeleteWithAccountxception extends BadRequestException {
  constructor() {
    super('Cannot delete training with associate accounts.');
  }
}
