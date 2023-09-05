import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from 'src/database/enums/role.enum';
import { Status } from 'src/database/enums/status.enum';

export class UpdateRoleAndStatusAccountDto {
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;

  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;
}
