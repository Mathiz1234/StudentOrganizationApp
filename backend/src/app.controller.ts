import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
    HealthCheck, HealthCheckResult, HealthCheckService, HttpHealthIndicator, TypeOrmHealthIndicator
} from '@nestjs/terminus';

import { ApiTagName } from './modules/shared/enums';
import { ConfigService } from './modules/shared/services/config/config.service';

@Controller({ version: '1' })
@ApiTags(ApiTagName.AppPublic)
export class AppController {
  constructor(
    private readonly healthService: HealthCheckService,
    private httpHealthIndicator: HttpHealthIndicator,
    private readonly configService: ConfigService,
  ) {}

  @Get('/healthcheck')
  @HealthCheck()
  healthCheck(): Promise<HealthCheckResult> {
    return this.healthService.check([
      () =>
        this.httpHealthIndicator.pingCheck(
          'api-docs',
          `${this.configService.serverUrl}/api-docs`,
        ),
      //TODO: Add database healthcheck
    ]);
  }
}
