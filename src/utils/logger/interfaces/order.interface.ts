import { IOrderItem } from './order-item.interface';
import { IOrderStatus } from './order-status.interface';
import { IPaymentMethod } from './payment-method.interface';
import { IPaymentStatus } from './payment-status.interface';
import { IUser } from './user.interface';

export interface IOrder {
  id: number;
  user: IUser;
  order_number: string;
  order_date: Date;
  total_amount: number;
  order_status: IOrderStatus;
  shipping_address: string;
  payment_status: IPaymentStatus;
  payment_method: IPaymentMethod;
  created_at: Date;
  updated_at: Date;
  orderItems?: IOrderItem[];
}
