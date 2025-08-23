import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  Body,
  Put,
  Patch,
  NotFoundException,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { ApiKeyGuard } from '../auth/api-key.guard';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

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
  async getProduct(@Param('id') id: string): Promise<Product> {
    const prod = await this.productsService.findOne(id);
    if (!prod) throw new NotFoundException();
    return prod;
  }

  @Post()
  @UseGuards(ApiKeyGuard)
  createProduct(@Body() body: CreateProductDto): Promise<Product> {
    return this.productsService.create(body);
  }

  @Put(':id')
  @UseGuards(ApiKeyGuard)
  updateProduct(
    @Param('id') id: string,
    @Body() body: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(id, body);
  }

  @Patch(':id')
  @UseGuards(ApiKeyGuard)
  patchProduct(
    @Param('id') id: string,
    @Body() body: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(ApiKeyGuard)
  deleteProduct(@Param('id') id: string): Promise<void> {
    return this.productsService.remove(id);
  }
}
