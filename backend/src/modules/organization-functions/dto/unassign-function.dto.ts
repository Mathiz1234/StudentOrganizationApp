import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UnassignFunctionDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  accountFunctionId: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  accountId: string;
}
