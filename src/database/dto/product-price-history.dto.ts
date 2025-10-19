export class ProductPriceHistoryDto {
  id: string;
  product_id: string;
  old_price: number;
  new_price: number;
  changed_by: string;
  changed_at: Date;
}
