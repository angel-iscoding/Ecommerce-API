export class OrderItemDto {
  id: number;
  order_id: number;
  product_id: number;
  cart_item_id: number;
  product_name: string;
  product_description: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: Date;
}
