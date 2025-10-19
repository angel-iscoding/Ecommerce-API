// order.entity.ts
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
import { User } from './user.entity';
import { OrderStatus } from './order-status.entity';
import { PaymentStatus } from './payment-status.entity';
import { PaymentMethod } from './payment-method.entity';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 50, unique: true })
  order_number: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  order_date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total_amount: number;

  @ManyToOne(() => OrderStatus, (orderStatus) => orderStatus.id)
  @JoinColumn({ name: 'order_status' })
  order_status: OrderStatus;

  @Column({ type: 'text' })
  shipping_address: string;

  @ManyToOne(() => PaymentStatus, (paymentStatus) => paymentStatus.id)
  @JoinColumn({ name: 'payment_status' })
  payment_status: PaymentStatus;

  @ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod.id)
  @JoinColumn({ name: 'payment_method' })
  payment_method: PaymentMethod;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];
}
