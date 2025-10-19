export class CartDto {
  id: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
  cartItems?: number[];
}
