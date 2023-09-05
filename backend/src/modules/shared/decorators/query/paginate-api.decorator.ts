import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiQuery } from '@nestjs/swagger';

export class PageDto {
  @ApiProperty({
    default: 1,
    required: false,
    description: 'Set page to be displayed',
  })
  page: Number;
}
export class PageSizeDto {
  @ApiProperty({
    default: 10,
    required: false,
    description: 'Set count of items per page',
  })
  pageSize: Number;
}

export function PaginateApi() {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      type: PageDto,
    }),
    ApiQuery({
      name: 'pageSize',
      type: PageSizeDto,
    }),
  );
}
