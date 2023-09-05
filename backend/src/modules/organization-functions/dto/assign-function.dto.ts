import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AssignFunctionDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  funcId: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  accountId: string;

  @IsString()
  @IsNotEmpty()
  year: string;
}
