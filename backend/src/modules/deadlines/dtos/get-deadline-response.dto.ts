import { Expose, Type } from 'class-transformer';
import { DdlType } from 'src/database/enums/ddl-type.enum';
import { GetProjectResponseDto } from 'src/modules/projects/dtos';

export class GetDeadlineResponseDto {
  @Expose()
  id: string;

  @Expose()
  description: string;

  @Expose()
  ddl: Date;

  @Expose()
  type: DdlType;

  @Expose()
  @Type(() => GetProjectResponseDto)
  project: GetProjectResponseDto;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
