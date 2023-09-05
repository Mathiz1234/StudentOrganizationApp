import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { IsOptional } from 'src/modules/shared/decorators';

export class FunctionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsUUID()
  @IsOptional()
  projectId: string;
}
