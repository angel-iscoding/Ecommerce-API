export class CartHistoryDto {
  id: number;
  user_id: number;
  product_id: number;
  action: string;
  quantity: number;
  old_quantity: number;
  unit_price: number;
  notes: string;
  created_at: Date;
}
