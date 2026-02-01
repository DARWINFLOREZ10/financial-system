import { env } from './env';

export const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Financial System API',
    version: '0.1.0',
    description: 'API for managing accounts, categories, transactions, and financial reports.',
  },
  servers: [
    { url: `http://localhost:${env.PORT}`, description: 'Local' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      LoginRequest: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8 },
        },
        required: ['email', 'password'],
      },
      RegisterRequest: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8 },
        },
        required: ['email', 'password'],
      },
      AuthResponse: {
        type: 'object',
        properties: {
          token: { type: 'string' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              email: { type: 'string' },
              role: { type: 'string', enum: ['ADMIN', 'USER'] },
            },
          },
        },
      },
      MonthlySummary: {
        type: 'object',
        properties: {
          income: { type: 'number' },
          expense: { type: 'number' },
          savings: { type: 'number' },
        },
      },
    },
  },
  paths: {
    '/api/auth/register': {
      post: {
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/RegisterRequest' } },
          },
        },
        responses: {
          '201': {
            description: 'User created',
            content: { 'application/json': { schema: {
              type: 'object', properties: { id: { type: 'string' }, email: { type: 'string' } },
            } } },
          },
          '400': { description: 'Validation error' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        summary: 'Login and receive a JWT',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } },
          },
        },
        responses: {
          '200': { description: 'Login successful', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
          '400': { description: 'Invalid credentials' },
        },
      },
    },
    '/api/reports/monthly-summary': {
      get: {
        summary: 'Monthly income/expense/savings summary',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'year', in: 'query', required: true, schema: { type: 'integer' } },
          { name: 'month', in: 'query', required: true, schema: { type: 'integer', minimum: 1, maximum: 12 } },
        ],
        responses: {
          '200': { description: 'Summary', content: { 'application/json': { schema: { $ref: '#/components/schemas/MonthlySummary' } } } },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/api/reports/spending-by-category': {
      get: {
        summary: 'Monthly spending amount by category',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'year', in: 'query', required: true, schema: { type: 'integer' } },
          { name: 'month', in: 'query', required: true, schema: { type: 'integer', minimum: 1, maximum: 12 } },
        ],
        responses: {
          '200': { description: 'Spending by category', content: { 'application/json': { schema: {
            type: 'object', additionalProperties: { type: 'number' },
          } } } },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/api/reports/cash-flow': {
      get: {
        summary: 'Cash flow per day (delta)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'from', in: 'query', required: true, schema: { type: 'string', format: 'date-time' } },
          { name: 'to', in: 'query', required: true, schema: { type: 'string', format: 'date-time' } },
        ],
        responses: {
          '200': { description: 'Daily cash flow', content: { 'application/json': { schema: {
            type: 'object', additionalProperties: { type: 'number' },
          } } } },
          '401': { description: 'Unauthorized' },
        },
      },
    },
  },
};
