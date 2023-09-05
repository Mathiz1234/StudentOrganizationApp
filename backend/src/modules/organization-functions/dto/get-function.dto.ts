import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class GetFunctionDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
