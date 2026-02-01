# Financial System API

A production-ready financial management API built with Node.js, TypeScript, Express, and Prisma. It demonstrates clean architecture, reporting endpoints, JWT auth, Swagger docs, unit tests, Docker, and CI.

## Features
- Clean architecture (domain, application, infrastructure, presentation)
- Auth: register, login, and protected endpoints
- Financial models: accounts, categories, transactions, budgets
- Reports: monthly summary, cash flow, spending by category
- Validation via Zod; centralized error handling; pino logging
- Prisma (PostgreSQL) with seed data
- Jest unit tests for core use cases
- Swagger docs at `/docs`

## Quick Start

### Prerequisites
- Node.js >= 18
- PostgreSQL (local or via Docker)

### Environment
Create a `.env` file:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/finance_db?schema=public"
JWT_SECRET="replace_with_a_strong_secret"
PORT=4001
```

### Install & Migrate
```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### Run
```bash
npm run dev
# or
npm run build && npm start
```

Swagger UI: `http://localhost:4001/docs`

### Seeded Account
- Admin: admin@finance.local / Admin123!

## Tests
```bash
npm test
```

## Docker (optional)
```bash
docker-compose up -d
```

## Project Structure
- src/config: environment, logger
- src/domain: entities and repository interfaces
- src/application: use cases/services
- src/infrastructure/prisma: Prisma client + repository implementations
- src/presentation: routes, controllers, middleware
- prisma: schema and seed
