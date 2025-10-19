// payment-method.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('payment_method')
export class PaymentMethod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20 })
  name: string;
}
