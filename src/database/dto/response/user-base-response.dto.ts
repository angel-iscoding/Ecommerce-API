import { Role } from "../../entities/role.entity";

export class UserBaseResponseDto {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  country: string;
  city: string;
  role: Role;
}