import { ICart } from './cart.interface';
import { IProduct } from './product.interface';
import { IUser } from './user.interface';

export interface ICartItem {
  id: number;
  cart: ICart;
  product: IProduct;
  quantity: number;
  notes: string;
  unit_price: number;
  created_by: IUser;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
}
