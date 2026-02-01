import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001'

export const api = axios.create({
  baseURL: API_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authAPI = {
  register: (email: string, password: string) =>
    api.post('/api/auth/register', { email, password }),
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),
}

export const accountsAPI = {
  list: () => api.get('/api/accounts'),
  create: (data: { name: string; type: string; currency: string }) =>
    api.post('/api/accounts', data),
}

export const categoriesAPI = {
  list: () => api.get('/api/categories'),
  create: (data: { name: string; type: string }) =>
    api.post('/api/categories', data),
}

export const transactionsAPI = {
  list: (from?: string, to?: string) =>
    api.get('/api/transactions', { params: { from, to } }),
  create: (data: {
    accountId: string
    categoryId?: string
    type: string
    amount: number
    occurredAt: string
    description?: string
  }) => api.post('/api/transactions', data),
}

export const reportsAPI = {
  monthlySummary: (year: number, month: number) =>
    api.get('/api/reports/monthly-summary', { params: { year, month } }),
  spendingByCategory: (year: number, month: number) =>
    api.get('/api/reports/spending-by-category', { params: { year, month } }),
  cashFlow: (from: string, to: string) =>
    api.get('/api/reports/cash-flow', { params: { from, to } }),
}
