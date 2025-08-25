import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { ProductAudit } from './product-audit.entity';

describe('ProductsService', () => {
  let service: ProductsService;

  const repositoryMockFactory = () => ({
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    merge: jest.fn(),
    save: jest.fn(),
    softRemove: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: getRepositoryToken(Product), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(ProductAudit), useFactory: repositoryMockFactory },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
