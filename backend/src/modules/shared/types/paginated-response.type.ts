import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

export abstract class PaginatedResponse<T> {
  @ApiProperty()
  @Expose()
  count: number;

  @Expose()
  data: T[];
}
