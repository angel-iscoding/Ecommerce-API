export class UserDto {
  id?: string;
  name: string;
  email: string;
  password: string;
  address: string;
  phone: number;
  country: string;
  city: string;
  role?: number;
  created_at?: Date;
  updated_at?: Date;
  cart_id?: number;
}
