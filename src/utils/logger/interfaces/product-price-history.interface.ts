import { IProduct } from './product.interface';
import { IUser } from './user.interface';

export interface IProductPriceHistory {
  id: number;
  product: IProduct;
  old_price: number;
  new_price: number;
  changed_by: IUser;
  changed_at: Date;
}
