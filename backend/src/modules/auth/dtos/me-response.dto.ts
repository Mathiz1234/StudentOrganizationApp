import { Expose } from 'class-transformer';
import { Role } from 'src/database/enums/role.enum';

export class MeResponseDto {
  @Expose()
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  role: Role;
}
