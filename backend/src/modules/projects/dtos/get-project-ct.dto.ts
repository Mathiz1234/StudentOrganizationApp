import { IsNotEmpty, IsString } from 'class-validator';

export class GetProjectCTDto {
  @IsString()
  @IsNotEmpty()
  year: string;
}
