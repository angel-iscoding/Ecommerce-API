import { IOrder } from './order.interface';
import { IProduct } from './product.interface';

export interface IOrderItem {
  id: string;
  order: IOrder;
  product: IProduct;
  cart_item_id: string;
  product_name: string;
  product_description: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: Date;
}
