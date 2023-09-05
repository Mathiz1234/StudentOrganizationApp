import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class GetProjectDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
