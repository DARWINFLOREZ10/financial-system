export type Role = 'ADMIN' | 'USER';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: Role;
  createdAt: Date;
}

export type AccountType = 'CHECKING' | 'SAVINGS' | 'CREDIT' | 'CASH';

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  currency: string; // e.g., "USD"
  createdAt: Date;
}

export type CategoryType = 'INCOME' | 'EXPENSE' | 'TRANSFER';

export interface Category {
  id: string;
  userId: string; // per-user categories
  name: string;
  type: CategoryType;
  createdAt: Date;
}

export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  categoryId?: string | null;
  type: TransactionType;
  amount: number; // positive amounts; sign derived from type
  occurredAt: Date;
  description?: string | null;
  createdAt: Date;
}

export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  amount: number; // monthly amount
  startDate: Date;
  endDate?: Date | null;
  createdAt: Date;
}
