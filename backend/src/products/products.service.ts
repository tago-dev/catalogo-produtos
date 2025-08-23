import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepo: Repository<Product>,
  ) {}

  findAll(): Promise<Product[]> {
    return this.productsRepo.find();
  }

  async create(data: CreateProductDto): Promise<Product> {
    const product = this.productsRepo.create(data as any);
    const saved = await this.productsRepo.save(product as any);
    return saved as Product;
  }

  findOne(id: string): Promise<Product | null> {
    return this.productsRepo.findOneBy({ id });
  }


  search(term: string): Promise<Product[]> {
    return this.productsRepo.find({
      where: { nome: Like(`%${term}%`) },
    });
  }
}
