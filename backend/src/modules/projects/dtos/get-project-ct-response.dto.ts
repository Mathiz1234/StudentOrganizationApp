import { Expose } from 'class-transformer';

export class GetProjectCTResponseDto {
  @Expose()
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  nick: string;

  @Expose()
  functionName: string;
}
