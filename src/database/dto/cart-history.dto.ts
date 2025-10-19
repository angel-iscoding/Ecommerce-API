export class CartHistoryDto {
  id: string;
  user_id: string;
  product_id: string;
  action: string;
  quantity: number;
  old_quantity: number;
  unit_price: number;
  notes: string;
  created_at: Date;
}
