import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { ProductAudit } from './product-audit.entity';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepo: Repository<Product>,
    @InjectRepository(ProductAudit)
    private auditRepo: Repository<ProductAudit>,
  ) {}

  findAll(): Promise<Product[]> {
    return this.productsRepo.find();
  }

  async update(id: string, data: UpdateProductDto): Promise<Product> {
    const existing = await this.findOne(id);
    if (!existing) {
      throw new NotFoundException();
    }
    const merged = this.productsRepo.merge(existing, data as Partial<Product>);
    const saved = await this.productsRepo.save(merged);
    return saved;
  }

  async create(data: CreateProductDto): Promise<Product> {
    const product = this.productsRepo.create(data as Partial<Product>);
    const saved = await this.productsRepo.save(product);
    return saved;
  }

  async remove(id: string): Promise<void> {
    const existing = await this.findOne(id);
    if (!existing) {
      throw new NotFoundException();
    }
    // soft-remove: using TypeORM soft remove via repository
    await this.productsRepo.softRemove(existing);

    // write audit
    try {
      const audit = this.auditRepo.create({
        productId: id,
        action: 'soft-delete',
        payload: existing,
        performedBy: undefined,
      });
      await this.auditRepo.save(audit);
    } catch (err) {
      // don't block deletion if audit fails, but log
      console.error('Failed to write audit record for product delete', err);
    }

    console.log(`Product ${id} soft-deleted`);
    return;
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
