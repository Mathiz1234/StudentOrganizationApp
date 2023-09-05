import { Role } from 'src/database/enums/role.enum';
import { RolesGuard } from 'src/modules/auth/guards';

// eslint-disable-next-line prettier/prettier
import { applyDecorators, ForbiddenException, SetMetadata, UseGuards } from '@nestjs/common';

import { ApiException } from '../exceptions';

export const ROLES_KEY = 'ROLES';
const Roles = (roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export const CheckRoles = (...roles: Role[]) =>
  applyDecorators(
    UseGuards(RolesGuard),
    Roles(roles),
    ApiException(() => ForbiddenException, {
      description: 'Your acount dont have required role.',
    }),
  );
