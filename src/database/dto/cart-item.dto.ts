export class CartItemDto {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  notes: string;
  unit_price: number;
  created_by: number;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
}
