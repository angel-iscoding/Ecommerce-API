export class ProductPriceHistoryDto {
  id: number;
  product_id: number;
  old_price: number;
  new_price: number;
  changed_by: string;
  changed_at: Date;
}
