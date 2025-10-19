import { IProduct } from './product.interface';

export interface ICategory {
  id: string;
  name: string;
  created_at: Date;
  products?: IProduct[];
}
