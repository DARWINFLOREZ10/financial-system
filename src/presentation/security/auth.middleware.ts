import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { PrismaUserRepository } from '../../infrastructure/prisma/repositories';
import { Request, Response, NextFunction } from 'express';

export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers['authorization'];
    if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ message: 'Missing token' });
    const token = header.slice('Bearer '.length);
    const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string; role: string };
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

export function requireRole(role: 'ADMIN' | 'USER') {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthenticated' });
    if (req.user.role !== role) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
}
