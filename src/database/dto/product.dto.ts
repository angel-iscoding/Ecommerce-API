export class ProductDto {
  id?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imgUrl?: string;
  // store category as id in DTOs (uuid)
  category_id?: string;
  created_at?: Date;
  updated_at?: Date;
}
