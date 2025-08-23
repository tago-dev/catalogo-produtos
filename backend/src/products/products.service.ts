import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepo: Repository<Product>,
  ) {}

  findAll(): Promise<Product[]> {
    return this.productsRepo.find();
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
