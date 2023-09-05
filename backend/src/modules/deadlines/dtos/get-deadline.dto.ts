import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class GetDeadlineDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
