// product.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Category } from './category.entity';
import { CartItem } from './cart-item.entity';
import { OrderItem } from './order-item.entity';
import { CartHistory } from './cart-history.entity';
import { ProductPriceHistory } from './product-price-history.entity';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ type: 'int', nullable: false })
  stock: number;

  @Column({
    name: 'imgUrl',
    type: 'varchar',
    default: 'ruta/a/tu/imagen/por/defecto.jpg',
  })
  imgUrl: string;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems: CartItem[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @OneToMany(() => CartHistory, (cartHistory) => cartHistory.product)
  cartHistory: CartHistory[];

  @OneToMany(() => ProductPriceHistory, (priceHistory) => priceHistory.product)
  priceHistory: ProductPriceHistory[];
}
