import { BadRequestException, NotFoundException } from '@nestjs/common';

export class ProjectAlreadyExistsException extends BadRequestException {
  constructor() {
    super('Project already exists.');
  }
}

export class ProjectNotFoundException extends NotFoundException {
  constructor() {
    super('Project not found.');
  }
}

export class ProjectCannotDeleteWithFunciontsException extends BadRequestException {
  constructor() {
    super('Cannot delete project with associate functions.');
  }
}
export class ProjectCannotDeleteWithDeadlinesException extends BadRequestException {
  constructor() {
    super('Cannot delete project with associate deadlines.');
  }
}
