import { IUser } from './user.interface';
import { IProduct } from './product.interface';

export interface ICartHistory {
  id: string;
  user: IUser;
  product: IProduct;
  action: string;
  quantity: number;
  old_quantity: number;
  unit_price: number;
  notes: string;
  created_at: Date;
}
