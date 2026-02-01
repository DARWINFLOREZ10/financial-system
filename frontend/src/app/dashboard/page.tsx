'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { reportsAPI, accountsAPI, transactionsAPI } from '@/lib/api'

export default function DashboardPage() {
  const router = useRouter()
  const [summary, setSummary] = useState<any>(null)
  const [accounts, setAccounts] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1

    Promise.all([
      reportsAPI.monthlySummary(year, month),
      accountsAPI.list(),
      transactionsAPI.list(),
    ])
      .then(([summaryRes, accountsRes, transactionsRes]) => {
        setSummary(summaryRes.data)
        setAccounts(accountsRes.data)
        setTransactions(transactionsRes.data.slice(0, 5))
      })
      .catch((err) => {
        console.error(err)
        if (err.response?.status === 401) {
          localStorage.removeItem('token')
          router.push('/login')
        }
      })
      .finally(() => setLoading(false))
  }, [router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-100 border border-green-300 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-green-800">Income</h2>
          <p className="text-3xl font-bold text-green-900">
            ${summary?.income?.toFixed(2) || '0.00'}
          </p>
        </div>
        <div className="bg-red-100 border border-red-300 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800">Expenses</h2>
          <p className="text-3xl font-bold text-red-900">
            ${summary?.expense?.toFixed(2) || '0.00'}
          </p>
        </div>
        <div className="bg-blue-100 border border-blue-300 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-800">Savings</h2>
          <p className="text-3xl font-bold text-blue-900">
            ${summary?.savings?.toFixed(2) || '0.00'}
          </p>
        </div>
      </div>

      {/* Accounts */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Your Accounts</h2>
        {accounts.length === 0 ? (
          <p className="text-gray-600">No accounts yet. Create one!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accounts.map((acc) => (
              <div key={acc.id} className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg">{acc.name}</h3>
                <p className="text-sm text-gray-600">
                  {acc.type} • {acc.currency}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Recent Transactions</h2>
        {transactions.length === 0 ? (
          <p className="text-gray-600">No transactions yet.</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <p className="font-medium">{tx.description || 'Transaction'}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(tx.occurredAt).toLocaleDateString()}
                  </p>
                </div>
                <p
                  className={`font-bold ${
                    tx.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {tx.type === 'INCOME' ? '+' : '-'}${tx.amount}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
