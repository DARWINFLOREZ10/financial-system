import { Router } from 'express';
import { PrismaTransactionRepository } from '../../infrastructure/prisma/repositories';
import { z } from 'zod';
import { authenticate } from '../security/auth.middleware';

const router = Router();
const transactions = PrismaTransactionRepository;

const createSchema = z.object({
  accountId: z.string().uuid(),
  categoryId: z.string().uuid().optional(),
  type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']),
  amount: z.number().positive(),
  occurredAt: z.string().transform((s) => new Date(s)),
  description: z.string().optional(),
});

router.post('/', authenticate, async (req, res, next) => {
  try {
    const data = createSchema.parse(req.body);
    const transaction = await transactions.create({ ...data, userId: req.user!.id });
    res.status(201).json(transaction);
  } catch (err) { next(err); }
});

router.get('/', authenticate, async (req, res, next) => {
  try {
    const schema = z.object({ from: z.string().optional(), to: z.string().optional() });
    const { from, to } = schema.parse(req.query);
    const result = await transactions.listByUser(
      req.user!.id,
      from ? new Date(from) : undefined,
      to ? new Date(to) : undefined
    );
    res.json(result);
  } catch (err) { next(err); }
});

export default router;
