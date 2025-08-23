import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './product.entity';
import { ProductAudit } from './product-audit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductAudit])],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
