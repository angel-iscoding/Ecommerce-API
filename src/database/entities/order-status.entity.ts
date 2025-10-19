// order-status.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('order_status')
export class OrderStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20 })
  status: string;
}
