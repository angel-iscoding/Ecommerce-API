export class CartDto {
  id: number;
  user_id: number;
  created_at: Date;
  updated_at: Date;
  cartItems?: number[];
}
