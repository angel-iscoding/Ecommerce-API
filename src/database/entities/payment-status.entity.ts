// payment-status.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('payment_status')
export class PaymentStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20 })
  status: string;
}
