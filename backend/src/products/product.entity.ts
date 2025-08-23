import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column('decimal', { precision: 10, scale: 2 })
  preco: number;

  @Column({ name: 'url_imagem', nullable: true })
  url_imagem: string;

  @Column({ name: 'quantidade_em_stock' })
  quantidade_em_stock: number;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
