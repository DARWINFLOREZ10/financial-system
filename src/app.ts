import express from 'express';
import cors from 'cors';
import { logger } from './config/logger';
import authRoutes from './presentation/routes/auth.routes';
import reportRoutes from './presentation/routes/reports.routes';
import accountRoutes from './presentation/routes/accounts.routes';
import categoryRoutes from './presentation/routes/categories.routes';
import transactionRoutes from './presentation/routes/transactions.routes';
import { health } from './presentation/controllers/health.controller';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', health);
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reports', reportRoutes);

// Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error({ err }, 'Unhandled error');
  const message = err?.message ?? 'Internal Server Error';
  res.status(400).json({ message });
});

export default app;
