import { Account } from 'src/database/entities';

import { PickType } from '@nestjs/swagger';

export class UpdateAccountType extends PickType(Account, [
  'firstName',
  'lastName',
  'email',
] as const) {}
