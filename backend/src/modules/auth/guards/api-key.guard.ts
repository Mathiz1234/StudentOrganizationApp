import { StrategyName } from 'src/modules/shared/enums';

import { AuthGuard } from '@nestjs/passport';

export const ApiKeyGuard = AuthGuard(StrategyName.ApiKey);
