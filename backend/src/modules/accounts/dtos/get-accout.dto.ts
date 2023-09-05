import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class GetAccountDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
