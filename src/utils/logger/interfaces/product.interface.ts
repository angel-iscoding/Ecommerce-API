import { ICartHistory } from './cart-history.interface';
import { ICartItem } from './cart-item.interface';
import { ICategory } from './category.interface';
import { IOrderItem } from './order-item.interface';
import { IProductPriceHistory } from './product-price-history.interface';

export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imgUrl: string;
  category: ICategory;
  created_at: Date;
  updated_at: Date;
  cartItems: ICartItem[];
  orderItems: IOrderItem[];
  cartHistory: ICartHistory[];
  priceHistory: IProductPriceHistory[];
}
