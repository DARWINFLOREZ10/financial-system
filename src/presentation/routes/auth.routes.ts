import { Router } from 'express';
import { AuthService } from '../../application/auth.service';
import { PrismaUserRepository } from '../../infrastructure/prisma/repositories';
import { z } from 'zod';

const router = Router();
const auth = new AuthService(PrismaUserRepository);

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

router.post('/register', async (req, res, next) => {
  try {
    const { email, password } = registerSchema.parse(req.body);
    const user = await auth.register(email, password);
    res.status(201).json({ id: user.id, email: user.email });
  } catch (err) { next(err); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = registerSchema.parse(req.body);
    const { user, token } = await auth.login(email, password);
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) { next(err); }
});

export default router;
