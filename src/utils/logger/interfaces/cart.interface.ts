import { ICartItem } from './cart-item.interface';
import { IUser } from './user.interface';

export interface ICart {
  id: string;
  user: IUser;
  created_at: Date;
  updated_at: Date;
  cartItems?: ICartItem[];
}
