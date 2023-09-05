import { IsDateString, IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { DdlType } from 'src/database/enums/ddl-type.enum';
import { IsOptional } from 'src/modules/shared/decorators/validation';

export class DeadlineDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  @IsNotEmpty()
  ddl: Date;

  @IsEnum(DdlType)
  @IsNotEmpty()
  type: DdlType;

  @IsUUID()
  @IsString()
  @IsOptional()
  projectId: string;
}
