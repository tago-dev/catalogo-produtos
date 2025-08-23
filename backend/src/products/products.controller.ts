import { Controller, Get, Param, Query, Post, Body } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';

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

  @Get('search')
  getProductsByTerm(@Query('term') term?: string): Promise<Product[]> {
    if (!term) {
      return this.productsService.findAll();
    }
    return this.productsService.search(term);
  }

  @Get(':id')
  getProduct(@Param('id') id: string): Promise<Product | null> {
    return this.productsService.findOne(id);
  }

  @Post()
  createProduct(@Body() body: CreateProductDto): Promise<Product> {
    return this.productsService.create(body);
  }

}
