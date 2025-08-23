import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getProducts(@Query('search') search?: string): Promise<Product[]> {
    if (search) {
      return this.productsService.search(search);
    }
    return this.productsService.findAll();
  }

  @Get(':id')
  getProduct(@Param('id') id: string): Promise<Product | null> {
    return this.productsService.findOne(id);
  }

}
