import { Expose, Type } from 'class-transformer';
import { GetProjectResponseDto } from 'src/modules/projects/dtos';

export class GetFunctionResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  @Type(() => GetProjectResponseDto)
  project: GetProjectResponseDto;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
