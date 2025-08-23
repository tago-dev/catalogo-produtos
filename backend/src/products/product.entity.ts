import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'image_url', nullable: true })
  urlImage: string;

  @Column({ name:'quantidade_em_estoque'} )
  quantidadeEmEstoque: number;
}
