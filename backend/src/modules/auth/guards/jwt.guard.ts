import { StrategyName } from 'src/modules/shared/enums';

import { AuthGuard } from '@nestjs/passport';

export const JwtGuard = AuthGuard(StrategyName.Jwt);
