/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
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
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
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

    const res = await supertest
      .default(app.getHttpServer())
      .post('/products')
      .send(body)
      .set('Accept', 'application/json')
      .set('x-api-key', process.env.API_KEY || 'test-key');

    const bodyAny = res.body;
    expect([200, 201]).toContain(res.status);
    expect(bodyAny).toBeDefined();
    expect(bodyAny.id).toBeDefined();
    expect(bodyAny.nome).toBe(body.nome);
    expect(Number(bodyAny.preco)).toBeCloseTo(body.preco);
    expect(Number(bodyAny.quantidade_em_stock)).toBe(body.quantidade_em_stock);
  });

  it('POST /products com preco negativo retorna 400', async () => {
    const body = {
      nome: 'Produto ruim',
      preco: -10,
      quantidade_em_stock: 1,
    };

    const res = await supertest
      .default(app.getHttpServer())
      .post('/products')
      .send(body)
      .set('Accept', 'application/json')
      .set('x-api-key', process.env.API_KEY || 'test-key');

    expect(res.status).toBe(400);
    expect(res.body).toBeDefined();
    // deve conter mensagem de validação
    expect(res.body.message).toBeDefined();
  });

  it('POST /products sem nome retorna 400', async () => {
    const body = {
      descricao: 'sem nome',
      preco: 10,
      quantidade_em_stock: 1,
    };

    const res = await supertest
      .default(app.getHttpServer())
      .post('/products')
      .send(body)
      .set('Accept', 'application/json')
      .set('x-api-key', process.env.API_KEY || 'test-key');

    expect(res.status).toBe(400);
    expect(res.body).toBeDefined();
    expect(res.body.message).toBeDefined();
  });

  it('PUT /products/:id atualiza um produto existente', async () => {
    // cria produto primeiro
    const createBody = {
      nome: 'Produto para atualizar',
      descricao: 'original',
      preco: 50,
      url_imagem: 'https://example.com/orig.jpg',
      quantidade_em_stock: 10,
    };

    const createRes = await supertest
      .default(app.getHttpServer())
      .post('/products')
      .send(createBody)
      .set('Accept', 'application/json')
      .set('x-api-key', process.env.API_KEY || 'test-key');

    expect([200, 201]).toContain(createRes.status);
    const id = createRes.body.id;
    expect(id).toBeDefined();

    const updateBody = {
      nome: 'Produto atualizado',
      preco: 60,
    };

    const updateRes = await supertest
      .default(app.getHttpServer())
      .put(`/products/${id}`)
      .send(updateBody)
      .set('Accept', 'application/json')
      .set('x-api-key', process.env.API_KEY || 'test-key');

    expect(updateRes.status).toBe(200);
    const updateBodyAny = updateRes.body;
    expect(updateBodyAny).toBeDefined();
    expect(updateBodyAny.id).toBe(id);
    expect(updateBodyAny.nome).toBe(updateBody.nome);
    expect(Number(updateBodyAny.preco)).toBeCloseTo(updateBody.preco);
  });

  it('PUT /products/:id para id inexistente retorna 404', async () => {
    const nonExistentId = '00000000-0000-4000-8000-000000000000';
    const updateBody = { nome: 'Nao existe' };

    const res = await supertest
      .default(app.getHttpServer())
      .put(`/products/${nonExistentId}`)
      .send(updateBody)
      .set('Accept', 'application/json')
      .set('x-api-key', process.env.API_KEY || 'test-key');

    expect(res.status).toBe(404);
  });

  it('DELETE /products/:id deleta um produto existente', async () => {
    const createBody = {
      nome: 'Produto para deletar',
      descricao: 'will be deleted',
      preco: 20,
      quantidade_em_stock: 2,
    };

    const createRes = await supertest
      .default(app.getHttpServer())
      .post('/products')
      .send(createBody)
      .set('Accept', 'application/json')
      .set('x-api-key', process.env.API_KEY || 'test-key');

    expect([200, 201]).toContain(createRes.status);
    const id = createRes.body.id;

    const delRes = await supertest
      .default(app.getHttpServer())
      .delete(`/products/${id}`)
      .set('Accept', 'application/json')
      .set('x-api-key', process.env.API_KEY || 'test-key');

    // espera 204 conforme padronizado
    expect(delRes.status).toBe(204);

    // GET/:id deve retornar 404 após remoção
    const getRes = await supertest
      .default(app.getHttpServer())
      .get(`/products/${id}`);
    expect(getRes.status).toBe(404);
  });

  it('DELETE /products/:id para id inexistente retorna 404', async () => {
    const nonExistentId = '00000000-0000-4000-8000-000000000000';
    const res = await supertest
      .default(app.getHttpServer())
      .delete(`/products/${nonExistentId}`)
      .set('Accept', 'application/json')
      .set('x-api-key', process.env.API_KEY || 'test-key');

    expect(res.status).toBe(404);
  });
});
