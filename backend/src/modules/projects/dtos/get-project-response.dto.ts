import { Expose, Type } from 'class-transformer';

export class GetProjectResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

export class GetProjectDetailsResponseDto {
  @Expose()
  @Type(() => GetProjectResponseDto)
  project: GetProjectResponseDto;

  @Expose()
  years: string[];
}
