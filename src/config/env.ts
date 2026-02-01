import dotenv from 'dotenv';
dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: parseInt(process.env.PORT ?? '4001', 10),
  JWT_SECRET: process.env.JWT_SECRET ?? 'replace_with_strong_secret',
  DATABASE_URL: process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/finance_db?schema=public',
};
