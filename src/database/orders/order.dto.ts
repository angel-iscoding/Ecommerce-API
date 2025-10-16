import { IsArray, IsDate, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { Product } from '@/database/products/product.entity';

export class OrderDto {
  @IsDate()
  @IsNotEmpty()
  date: Date;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsUUID()
  @IsNotEmpty()
  user: string;

  @IsArray()
  @IsNotEmpty()
  product: Product[];
}
