import { Account } from 'src/database/entities';

import { PickType } from '@nestjs/swagger';

export class CreateAccountType extends PickType(Account, [
  'firstName',
  'lastName',
  'email',
  'googleUserIdentifier',
] as const) {}
