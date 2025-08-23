import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as supertest from 'supertest';
import { AppModule } from './../src/app.module';
import { DataSource } from 'typeorm';

describe('Products (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = app.get(DataSource);
  });

  beforeEach(async () => {
    // limpar tabela products para garantir ambiente limpo
    await dataSource.query('DELETE FROM products');
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /products cria um produto válido', async () => {
    const body = {
      nome: 'Teste E2E Camiseta',
      descricao: 'Descrição teste',
      preco: 29.9,
      url_imagem: 'https://example.com/img.jpg',
      quantidade_em_stock: 5,
    };

    const res = await supertest.default(app.getHttpServer())
      .post('/products')
      .send(body)
      .set('Accept', 'application/json');

    expect([200, 201]).toContain(res.status);
    expect(res.body).toBeDefined();
    expect(res.body.id).toBeDefined();
    expect(res.body.nome).toBe(body.nome);
    expect(Number(res.body.preco)).toBeCloseTo(body.preco);
    expect(Number(res.body.quantidade_em_stock)).toBe(body.quantidade_em_stock);
  });
});
