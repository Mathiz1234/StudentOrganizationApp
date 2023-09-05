import { Expose, Type } from 'class-transformer';
import { Role } from 'src/database/enums/role.enum';
import { Status } from 'src/database/enums/status.enum';
import { TShirtSize } from 'src/database/enums/t-shirt-size.enum';

class AccountResponse {
  @Expose()
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  nick: string;

  @Expose()
  address: string;

  @Expose()
  city: string;

  @Expose()
  zipCode: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  joined: string;

  @Expose()
  faculty: string;

  @Expose()
  fieldOfStudy: string;

  @Expose()
  studyYear: number;

  @Expose()
  studyGroup: number;

  @Expose()
  tShirtSize: TShirtSize;

  @Expose()
  role: Role;

  @Expose()
  status: Status;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  email: string;
}

class Project {
  @Expose()
  id: string;

  @Expose()
  name: string;
}

class OrganizationFunction {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  @Type(() => Project)
  project: Project;
}
class AccountFunction {
  @Expose()
  id: string;

  @Expose()
  year: string;

  @Expose()
  @Type(() => OrganizationFunction)
  organizationFunction: OrganizationFunction;
}

class AccountTraining {
  @Expose()
  id: string;

  @Expose()
  name: string;
}

export class AccountWithDetailsResponseDto extends AccountResponse {
  @Expose()
  birthday: Date;

  @Expose()
  @Type(() => AccountFunction)
  functions: AccountFunction;

  @Expose()
  @Type(() => AccountTraining)
  trainings: AccountTraining;
}

export class AccountResponseDto extends AccountResponse {
  @Expose()
  birthday: Date;
}

export class AccountWithBirthdayCountResponseDto extends AccountResponse {
  @Expose()
  birthday: Date;

  @Expose()
  birthdayCount: number;
}
