import { ReportsService } from '../src/application/reports.service';
import { TransactionRepository, AccountRepository } from '../src/domain/repositories';
import { Transaction } from '../src/domain/entities';

const makeTx = (type: 'INCOME'|'EXPENSE', amount: number, day: number): Transaction => ({
  id: String(Math.random()), userId: 'u1', accountId: 'a1', categoryId: null,
  type, amount, occurredAt: new Date(Date.UTC(2026, 0, day)), description: '', createdAt: new Date()
});

describe('ReportsService', () => {
  const txRepo: TransactionRepository = {
    create: async () => { throw new Error('not used'); },
    listByUser: async (userId, from, to) => {
      return [makeTx('INCOME', 3000, 1), makeTx('EXPENSE', 200, 3), makeTx('EXPENSE', 150, 10)];
    },
  };
  const accRepo: AccountRepository = {
    create: async () => { throw new Error('not used'); },
    listByUser: async () => []
  };

  it('calculates monthly summary', async () => {
    const svc = new ReportsService(txRepo, accRepo);
    const result = await svc.monthlySummary('u1', 2026, 1);
    expect(result.income).toBe(3000);
    expect(result.expense).toBe(350);
    expect(result.savings).toBe(2650);
  });

  it('computes cash flow daily deltas', async () => {
    const svc = new ReportsService(txRepo, accRepo);
    const from = new Date(Date.UTC(2026, 0, 1));
    const to = new Date(Date.UTC(2026, 0, 31));
    const flow = await svc.cashFlow('u1', from, to);
    expect(flow['2026-01-01']).toBe(3000);
    expect(flow['2026-01-03']).toBe(-200);
    expect(flow['2026-01-10']).toBe(-150);
  });
});
