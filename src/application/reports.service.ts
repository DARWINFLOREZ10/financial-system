import { TransactionRepository, AccountRepository } from '../domain/repositories';
import { Transaction } from '../domain/entities';

export class ReportsService {
  constructor(
    private transactions: TransactionRepository,
    private accounts: AccountRepository,
  ) {}

  private sum(transactions: Transaction[]): { income: number; expense: number } {
    let income = 0, expense = 0;
    for (const t of transactions) {
      if (t.type === 'INCOME') income += t.amount;
      if (t.type === 'EXPENSE') expense += t.amount;
    }
    return { income, expense };
  }

  async monthlySummary(userId: string, year: number, month: number) {
    const from = new Date(Date.UTC(year, month - 1, 1));
    const to = new Date(Date.UTC(year, month, 0, 23, 59, 59));
    const tx = await this.transactions.listByUser(userId, from, to);
    const { income, expense } = this.sum(tx);
    const savings = income - expense;
    return { income, expense, savings };
  }

  async spendingByCategory(userId: string, year: number, month: number) {
    const from = new Date(Date.UTC(year, month - 1, 1));
    const to = new Date(Date.UTC(year, month, 0, 23, 59, 59));
    const tx = await this.transactions.listByUser(userId, from, to);
    const map: Record<string, number> = {};
    for (const t of tx) {
      if (t.type === 'EXPENSE' && t.categoryId) {
        map[t.categoryId] = (map[t.categoryId] ?? 0) + t.amount;
      }
    }
    return map;
  }

  async cashFlow(userId: string, from: Date, to: Date) {
    const tx = await this.transactions.listByUser(userId, from, to);
    const daily: Record<string, number> = {};
    for (const t of tx) {
      const dateKey = t.occurredAt.toISOString().slice(0, 10);
      const delta = t.type === 'INCOME' ? t.amount : t.type === 'EXPENSE' ? -t.amount : 0;
      daily[dateKey] = (daily[dateKey] ?? 0) + delta;
    }
    return daily;
  }
}
