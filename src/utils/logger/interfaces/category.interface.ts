import { IProduct } from './product.interface';

export interface ICategory {
  id: number;
  name: string;
  created_at: Date;
  products?: IProduct[];
}
