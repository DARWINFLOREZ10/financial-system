'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { transactionsAPI, accountsAPI, categoriesAPI } from '@/lib/api'

export default function TransactionsPage() {
  const router = useRouter()
  const [transactions, setTransactions] = useState<any[]>([])
  const [accounts, setAccounts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    accountId: '',
    categoryId: '',
    type: 'EXPENSE',
    amount: '',
    occurredAt: new Date().toISOString().split('T')[0],
    description: '',
  })

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/login')
      return
    }
    loadData()
  }, [router])

  const loadData = async () => {
    try {
      const [txRes, accRes, catRes] = await Promise.all([
        transactionsAPI.list(),
        accountsAPI.list(),
        categoriesAPI.list(),
      ])
      setTransactions(txRes.data)
      setAccounts(accRes.data)
      setCategories(catRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await transactionsAPI.create({
        ...formData,
        amount: parseFloat(formData.amount),
        occurredAt: new Date(formData.occurredAt).toISOString(),
        categoryId: formData.categoryId || undefined,
      })
      setFormData({
        accountId: '',
        categoryId: '',
        type: 'EXPENSE',
        amount: '',
        occurredAt: new Date().toISOString().split('T')[0],
        description: '',
      })
      setShowForm(false)
      loadData()
    } catch (err) {
      alert('Failed to create transaction')
    }
  }

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Transactions</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          {showForm ? 'Cancel' : 'Add Transaction'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Create Transaction</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Account</label>
              <select
                value={formData.accountId}
                onChange={(e) =>
                  setFormData({ ...formData, accountId: e.target.value })
                }
                required
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">Select account</option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">Select category (optional)</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.type})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
                <option value="TRANSFER">Transfer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Amount</label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <input
                type="date"
                value={formData.occurredAt}
                onChange={(e) =>
                  setFormData({ ...formData, occurredAt: e.target.value })
                }
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
            >
              Create Transaction
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">All Transactions</h2>
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex justify-between items-center border-b pb-3"
            >
              <div>
                <p className="font-medium">{tx.description || 'Transaction'}</p>
                <p className="text-sm text-gray-500">
                  {new Date(tx.occurredAt).toLocaleDateString()} • {tx.type}
                </p>
              </div>
              <p
                className={`font-bold text-lg ${
                  tx.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {tx.type === 'INCOME' ? '+' : '-'}${tx.amount}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
