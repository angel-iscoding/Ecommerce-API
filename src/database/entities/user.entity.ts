// user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Cart } from './cart.entity';
import { Role } from './role.entity';
import { Order } from './order.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'varchar', nullable: false })
  address: string;

  @Column({ type: 'varchar', nullable: false })
  phone: string;

  @Column({ type: 'varchar', nullable: false })
  country: string;

  @Column({ type: 'varchar', nullable: false })
  city: string;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToOne(() => Cart, (cart) => cart.user)
  cart: Cart;
  
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
