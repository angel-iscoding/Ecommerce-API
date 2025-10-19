import { ICart } from './cart.interface';
import { IRole } from './roles.interface';

export interface IUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  address: string;
  phone: number;
  country: string;
  city: string;
  role: IRole;
  created_at: Date;
  updated_at: Date;
  cart?: ICart;
}
