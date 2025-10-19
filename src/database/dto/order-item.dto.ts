export class OrderItemDto {
  id: string;
  order_id: string;
  product_id: string;
  cart_item_id: string;
  product_name: string;
  product_description: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: Date;
}
