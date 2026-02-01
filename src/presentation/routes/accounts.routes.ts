import { Router } from 'express';
import { PrismaAccountRepository } from '../../infrastructure/prisma/repositories';
import { z } from 'zod';
import { authenticate } from '../security/auth.middleware';

const router = Router();
const accounts = PrismaAccountRepository;

const createSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['CHECKING', 'SAVINGS', 'CREDIT', 'CASH']),
  currency: z.string().length(3),
});

router.post('/', authenticate, async (req, res, next) => {
  try {
    const data = createSchema.parse(req.body);
    const account = await accounts.create({ ...data, userId: req.user!.id });
    res.status(201).json(account);
  } catch (err) { next(err); }
});

router.get('/', authenticate, async (req, res, next) => {
  try {
    const result = await accounts.listByUser(req.user!.id);
    res.json(result);
  } catch (err) { next(err); }
});

export default router;
