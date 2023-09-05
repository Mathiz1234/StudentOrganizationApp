import { IsNotEmpty, IsString } from 'class-validator';

export class TrainingDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
