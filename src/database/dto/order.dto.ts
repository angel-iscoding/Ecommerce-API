export class OrderDto {
  id: string;
  user_id: string;
  order_number: string;
  order_date: Date;
  total_amount: number;
  order_status: number;
  shipping_address: string;
  payment_status: number;
  payment_method: number;
  created_at: Date;
  updated_at: Date;
  orderItems?: number[];
}
