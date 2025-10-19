// product-price-history.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { User } from './user.entity';

@Entity('product_price_history')
export class ProductPriceHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, (product) => product.priceHistory)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  old_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  new_price: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'changed_by' })
  changed_by: User;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  changed_at: Date;
}
