export class CartItemDto {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  notes: string;
  unit_price: number;
  created_by: number;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
}
