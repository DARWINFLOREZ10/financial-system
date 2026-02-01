import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../domain/repositories';
import { User } from '../domain/entities';
import { env } from '../config/env';

export class AuthService {
  constructor(private users: UserRepository) {}

  async register(email: string, password: string): Promise<User> {
    const existing = await this.users.findByEmail(email);
    if (existing) throw new Error('Email already in use');
    const passwordHash = await bcrypt.hash(password, 10);
    return this.users.create({ email, passwordHash, role: 'USER' });
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = await this.users.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new Error('Invalid credentials');
    const token = jwt.sign({ sub: user.id, role: user.role }, env.JWT_SECRET, { expiresIn: '8h' });
    return { user, token };
  }
}
