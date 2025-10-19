import { Cart } from '@/database/entities/cart.entity';
import { Role } from '@/database/entities/role.entity';

export interface IUser {
  id?: string;
  name: string;
  email: string;
  password: string;
  address: string;
  phone: string;
  country: string;
  city: string;
  role: Role;
  created_at?: Date;
  updated_at?: Date;
  cart?: Cart;
}
