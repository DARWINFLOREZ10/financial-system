import { User, Account, Category, Transaction, Budget } from './entities';

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(user: Omit<User, 'id' | 'createdAt'>): Promise<User>;
}

export interface AccountRepository {
  create(data: Omit<Account, 'id' | 'createdAt'>): Promise<Account>;
  listByUser(userId: string): Promise<Account[]>;
}

export interface CategoryRepository {
  create(data: Omit<Category, 'id' | 'createdAt'>): Promise<Category>;
  listByUser(userId: string): Promise<Category[]>;
}

export interface TransactionRepository {
  create(data: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction>;
  listByUser(userId: string, from?: Date, to?: Date): Promise<Transaction[]>;
}

export interface BudgetRepository {
  create(data: Omit<Budget, 'id' | 'createdAt'>): Promise<Budget>;
  listByUser(userId: string): Promise<Budget[]>;
}
