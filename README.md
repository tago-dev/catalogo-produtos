# Catálogo de Produtos — Desafio Full Stack

[![CI](https://github.com/tago-dev/catalogo-produtos/actions/workflows/ci.yml/badge.svg)](https://github.com/tago-dev/catalogo-produtos/actions/workflows/ci.yml)

Aplicação full stack para gestão de produtos com frontend em React, backend em NestJS e banco MySQL, empacotada com Docker Compose. Este README reúne tudo que você precisa para instalar, rodar, testar e entender o projeto.

## Sumário

- Visão geral
- Arquitetura e tecnologias
- Requisitos
- Como executar (Docker) — recomendado
- Como executar (ambiente local)
- Variáveis de ambiente
- Endpoints da API
- Banco de dados e migrações
- Testes
- Integração Contínua (CI)
- Estrutura do repositório
- Decisões e trade-offs
- Troubleshooting

## Visão geral

O sistema lista, pesquisa, cria, atualiza e remove (soft delete) produtos. Operações de escrita exigem API Key. O frontend consome a API e é servido por Nginx, com proxy para o backend.

## Arquitetura e tecnologias

- Frontend: React + TypeScript (Create React App) com CSS utilitário simples; Nginx serve a SPA e faz proxy de `/products` para o backend.
- Backend: NestJS + TypeORM (MySQL). Soft delete em `products` e auditoria em `product_audit`.
- Banco: MySQL 8, inicialização com schema/seed.
- Infra: Docker Compose (db, backend, frontend).

## Requisitos

- Docker Desktop e Docker Compose (v2)
- Porta 3000 livre (frontend) e 3001 livre (backend)

## Como executar (Docker) — recomendado

1. Suba os serviços:

```powershell
docker compose up -d --build
```

2. Acesse:

- Frontend: http://localhost:3000
- Backend (API): http://localhost:3001/products

Observações:

- O Nginx do frontend faz proxy de `/products` para o backend (não é necessário configurar REACT_APP_API_URL para Docker local).
- A API exige header `x-api-key` para POST/PUT/PATCH/DELETE (valor padrão: `supersecret`).

3. Parar/derrubar:

```powershell
docker compose down
```

## Como executar (ambiente local)

Você pode rodar backend e frontend fora do Docker para desenvolvimento.

Backend (NestJS):

```powershell
cd backend
npm ci
$env:DB_HOST="127.0.0.1"; $env:DB_PORT="3306"; $env:DB_USER="root"; $env:DB_PASS="example"; $env:DB_NAME="catalogo"; $env:API_KEY="supersecret"; $env:TYPEORM_SYNC="false"
npm run start:dev
```

Frontend (CRA):

```powershell
cd frontend
npm ci
# Se o backend estiver no http://localhost:3001, deixe REACT_APP_API_URL vazio para usar same-origin via Nginx quando em Docker;
# fora do Docker, aponte para o backend local se necessário:
$env:REACT_APP_API_URL="http://localhost:3001"; $env:REACT_APP_API_KEY="supersecret"
npm start
```

## Variáveis de ambiente

No `docker-compose.yml`:

- Backend
  - `PORT` (3001)
  - `DB_HOST` (db)
  - `DB_PORT` (3306)
  - `DB_USER` (root)
  - `DB_PASS` (example)
  - `DB_NAME` (catalogo)
  - `TYPEORM_SYNC` ("false")
  - `API_KEY` (supersecret)
- Frontend (args de build)
  - `REACT_APP_API_URL` ("" para same-origin via Nginx)
  - `REACT_APP_API_KEY` (propaga como header `x-api-key` em chamadas de escrita)

Altere os valores conforme sua necessidade antes de construir/subir os serviços.

## Endpoints da API

Base: `http://localhost:3001`

- GET `/products` — lista todos os produtos; suporta `?search=termo`
- GET `/products/search?term=termo` — busca por termo
- GET `/products/:id` — detalhes de um produto
- POST `/products` — cria um produto (requer `x-api-key`)
- PUT `/products/:id` — atualiza o produto por ID (requer `x-api-key`)
- PATCH `/products/:id` — atualização parcial (requer `x-api-key`)
- DELETE `/products/:id` — remove (soft delete) (requer `x-api-key`), retorna 204

Modelo de produto (campos):

```json
{
  "nome": "Camiseta",
  "descricao": "100% algodão",
  "preco": 49.9,
  "url_imagem": "https://...",
  "quantidade_em_stock": 15
}
```

Exemplos (PowerShell + curl):

```powershell
curl "http://localhost:3001/products"

curl -X POST "http://localhost:3001/products" `
	-H "Content-Type: application/json" `
	-H "x-api-key: supersecret" `
	-d '{"nome":"Camiseta","descricao":"100% algodão","preco":49.9,"quantidade_em_stock":15}'
```

Notas de segurança:

- A `x-api-key` é verificada no backend (`backend/src/auth/api-key.guard.ts`).
- Em produção, configure um valor seguro por ambiente (não comite secrets).

## Banco de dados e migrações

- Schema inicial e seed são aplicados via `backend/mysql/init` quando o container do MySQL sobe pela primeira vez.
- Migrações adicionais estão em `backend/mysql/migrations`.
- Scripts de migração:

```powershell
cd backend
npm run migrate:up   # aplica a migração 20250823 (deleted_at e auditoria)
npm run migrate:down # reverte
```

Tabelas principais:

- `products`: inclui soft delete (`deleted_at`).
- `product_audit`: registra operações de criação/atualização/remoção.

## Testes

Backend (unit/e2e):

```powershell
cd backend
npm ci
npm run test         # unit
npm run test:e2e     # e2e (exige MySQL acessível conforme env)
```

Sugestão de CI: executar lint, build e testes (há um exemplo de workflow no `backend/README.md`).

## Integração Contínua (CI)

Há um workflow do GitHub Actions em `.github/workflows/ci.yml` que executa automaticamente em push e PR para `main`:

- Backend: instala deps, sobe MySQL de serviço, roda testes unitários e e2e com `NODE_ENV=test`.
- Frontend: instala deps, faz build e executa testes (modo CI).

Você pode acompanhar as execuções e logs na aba Actions do repositório ou clicando no badge de status acima.

## Estrutura do repositório

```
docker-compose.yml
backend/
	Dockerfile
	mysql/
		init/        # schema/seed aplicados na criação do volume
		migrations/  # migrações manuais (run-migration.js)
	src/
		products/    # controller, service, entidades e DTOs
		auth/        # ApiKey guard
frontend/
	Dockerfile
	nginx.conf     # SPA + proxy /products -> backend
	src/           # React + TS
```

## Decisões e trade-offs

- TypeORM `synchronize` desabilitado por padrão para evitar drift de schema; usamos SQL versionado.
- API Key simples via header para operações que modificam dados; suficiente ao escopo do desafio.
- Frontend em Nginx com proxy para simplificar chamadas e evitar CORS.
- CSS utilitário próprio em vez de Tailwind para manter simplicidade e controle visual.

## Troubleshooting

- DB não sobe/`ECONNREFUSED` no backend: aguarde o `healthcheck` do MySQL ficar saudável; o backend só inicia após isso.
- Porta em uso (3000/3001): altere o mapeamento em `docker-compose.yml` ou libere as portas.
- 401 em POST/PUT/PATCH/DELETE: verifique o header `x-api-key` e o valor de `API_KEY` no backend.
- Mudanças no frontend não aparecem no Docker: refaça o build do frontend

```powershell
docker compose build frontend; docker compose up -d frontend
```

---

Projeto para avaliação técnica. Em caso de dúvidas, consulte os READMEs de `backend/` e `frontend/` ou abra uma issue.
