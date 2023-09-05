// eslint-disable-next-line prettier/prettier
import { IsDateString, IsEnum, IsInt, IsPhoneNumber, IsString, Max } from 'class-validator';
import { TShirtSize } from 'src/database/enums/t-shirt-size.enum';
import { IsOptional } from 'src/modules/shared/decorators';

export class UpdateAccountDto {
  @IsString()
  @IsOptional()
  nick: string;

  @IsDateString()
  @IsOptional()
  birthday: Date;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  city: string;

  @IsString()
  @IsOptional()
  zipCode: string;

  @IsPhoneNumber('PL')
  @IsOptional()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  joined: string;

  @IsString()
  @IsOptional()
  faculty: string;

  @IsString()
  @IsOptional()
  fieldOfStudy: string;

  @IsInt()
  @Max(7)
  @IsOptional()
  studyYear: number;

  @IsInt()
  @IsOptional()
  studyGroup: number;

  @IsEnum(TShirtSize)
  @IsOptional()
  tShirtSize: TShirtSize;
}
