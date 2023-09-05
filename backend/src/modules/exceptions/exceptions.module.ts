import { Global, Module } from '@nestjs/common';

import { ExceptionsService } from './exceptions.service';
import { CatchAllExceptionsFilter } from './filters';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [CatchAllExceptionsFilter, ExceptionsService],
  exports: [CatchAllExceptionsFilter, ExceptionsService],
})
export class ExceptionsModule {}
