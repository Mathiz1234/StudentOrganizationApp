import { IsEnum, IsString, IsUUID } from 'class-validator';
import { DdlType } from 'src/database/enums/ddl-type.enum';
import { IsOptional } from 'src/modules/shared/decorators';

export class GetDeadlinesDto {
  @IsEnum(DdlType)
  @IsOptional()
  type: DdlType;

  @IsString()
  @IsUUID()
  @IsOptional()
  projectId: string;
}
