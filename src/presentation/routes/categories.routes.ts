import { Router } from 'express';
import { PrismaCategoryRepository } from '../../infrastructure/prisma/repositories';
import { z } from 'zod';
import { authenticate } from '../security/auth.middleware';

const router = Router();
const categories = PrismaCategoryRepository;

const createSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']),
});

router.post('/', authenticate, async (req, res, next) => {
  try {
    const data = createSchema.parse(req.body);
    const category = await categories.create({ ...data, userId: req.user!.id });
    res.status(201).json(category);
  } catch (err) { next(err); }
});

router.get('/', authenticate, async (req, res, next) => {
  try {
    const result = await categories.listByUser(req.user!.id);
    res.json(result);
  } catch (err) { next(err); }
});

export default router;
