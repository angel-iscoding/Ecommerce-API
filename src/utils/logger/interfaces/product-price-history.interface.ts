import { IProduct } from './product.interface';
import { IUser } from './user.interface';

export interface IProductPriceHistory {
  id: string;
  product: IProduct;
  old_price: number;
  new_price: number;
  changed_by: IUser;
  changed_at: Date;
}
