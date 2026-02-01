import { Router } from 'express';
import { ReportsService } from '../../application/reports.service';
import { PrismaTransactionRepository, PrismaAccountRepository } from '../../infrastructure/prisma/repositories';
import { z } from 'zod';
import { authenticate } from '../security/auth.middleware';

const router = Router();
const reports = new ReportsService(PrismaTransactionRepository, PrismaAccountRepository);

router.get('/monthly-summary', authenticate, async (req, res, next) => {
  try {
    const schema = z.object({ year: z.coerce.number(), month: z.coerce.number().min(1).max(12) });
    const { year, month } = schema.parse(req.query);
    const result = await reports.monthlySummary(req.user!.id, year, month);
    res.json(result);
  } catch (err) { next(err); }
});

router.get('/spending-by-category', authenticate, async (req, res, next) => {
  try {
    const schema = z.object({ year: z.coerce.number(), month: z.coerce.number().min(1).max(12) });
    const { year, month } = schema.parse(req.query);
    const result = await reports.spendingByCategory(req.user!.id, year, month);
    res.json(result);
  } catch (err) { next(err); }
});

router.get('/cash-flow', authenticate, async (req, res, next) => {
  try {
    const schema = z.object({ from: z.string(), to: z.string() });
    const { from, to } = schema.parse(req.query);
    const result = await reports.cashFlow(req.user!.id, new Date(from), new Date(to));
    res.json(result);
  } catch (err) { next(err); }
});

export default router;
