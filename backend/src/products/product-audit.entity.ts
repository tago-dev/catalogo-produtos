import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('product_audit')
export class ProductAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string;

  @Column()
  action: string; // e.g. 'soft-delete'

  @Column({ type: 'json', nullable: true })
  payload: any;

  @Column({ nullable: true })
  performedBy?: string;

  @CreateDateColumn({ name: 'performed_at' })
  performedAt: Date;
}
