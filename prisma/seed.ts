import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@finance.local' },
    update: {},
    create: { email: 'admin@finance.local', passwordHash, role: 'ADMIN' },
  });

  const checking = await prisma.account.create({
    data: { userId: admin.id, name: 'Main Checking', type: 'CHECKING', currency: 'USD' },
  });

  const salaryCat = await prisma.category.create({
    data: { userId: admin.id, name: 'Salary', type: 'INCOME' },
  });
  const groceriesCat = await prisma.category.create({
    data: { userId: admin.id, name: 'Groceries', type: 'EXPENSE' },
  });

  const now = new Date();
  await prisma.transaction.create({
    data: {
      userId: admin.id,
      accountId: checking.id,
      categoryId: salaryCat.id,
      type: 'INCOME',
      amount: 3000,
      occurredAt: new Date(now.getFullYear(), now.getMonth(), 1),
      description: 'Monthly salary',
    },
  });
  await prisma.transaction.create({
    data: {
      userId: admin.id,
      accountId: checking.id,
      categoryId: groceriesCat.id,
      type: 'EXPENSE',
      amount: 250,
      occurredAt: new Date(now.getFullYear(), now.getMonth(), 3),
      description: 'Groceries',
    },
  });

  console.log('Seed completed');
}

main().finally(() => prisma.$disconnect());
