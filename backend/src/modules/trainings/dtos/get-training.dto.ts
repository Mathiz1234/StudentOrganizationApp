import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class GetTrainingDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
