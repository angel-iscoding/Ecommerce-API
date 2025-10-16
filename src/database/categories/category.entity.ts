import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinColumn,
} from 'typeorm';
import { Product } from '@/database/products/product.entity'; // Asegúrate de importar la entidad Product

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  name: string;

  @ManyToMany(() => Product, (product) => product.category)
  @JoinColumn()
  products: Product[];
}
