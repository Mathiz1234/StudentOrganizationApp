import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UnassignTrainingDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  trainingId: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  accountId: string;
}
