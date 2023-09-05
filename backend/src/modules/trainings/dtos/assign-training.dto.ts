import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AssignTrainingDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  trainingId: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  accountId: string;
}
