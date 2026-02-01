import { prisma } from './client';
import { UserRepository, AccountRepository, CategoryRepository, TransactionRepository, BudgetRepository } from '../../domain/repositories';
import { User, Account, Category, Transaction, Budget } from '../../domain/entities';

export const PrismaUserRepository: UserRepository = {
  async findByEmail(email) { return prisma.user.findUnique({ where: { email } }) as any; },
  async findById(id) { return prisma.user.findUnique({ where: { id } }) as any; },
  async create(data) { return prisma.user.create({ data }) as any; },
};

export const PrismaAccountRepository: AccountRepository = {
  async create(data) { return prisma.account.create({ data }) as any; },
  async listByUser(userId) { return prisma.account.findMany({ where: { userId } }) as any; },
};

export const PrismaCategoryRepository: CategoryRepository = {
  async create(data) { return prisma.category.create({ data }) as any; },
  async listByUser(userId) { return prisma.category.findMany({ where: { userId } }) as any; },
};

export const PrismaTransactionRepository: TransactionRepository = {
  async create(data) { 
    const result = await prisma.transaction.create({ data });
    return { ...result, amount: Number(result.amount) } as any; 
  },
  async listByUser(userId, from, to) {
    const rows = await prisma.transaction.findMany({
      where: {
        userId,
        occurredAt: from && to ? { gte: from, lte: to } : undefined,
      },
      orderBy: { occurredAt: 'asc' },
    });
    return rows.map((t: any) => ({ ...t, amount: Number(t.amount) })) as any;
  },
};

export const PrismaBudgetRepository: BudgetRepository = {
  async create(data) { 
    const result = await prisma.budget.create({ data });
    return { ...result, amount: Number(result.amount) } as any;
  },
  async listByUser(userId) { 
    const rows = await prisma.budget.findMany({ where: { userId } });
    return rows.map((b: any) => ({ ...b, amount: Number(b.amount) })) as any;
  },
};
