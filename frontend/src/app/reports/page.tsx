'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { reportsAPI } from '@/lib/api'

export default function ReportsPage() {
  const router = useRouter()
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [summary, setSummary] = useState<any>(null)
  const [spendingByCategory, setSpendingByCategory] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/login')
      return
    }
  }, [router])

  const loadReports = async () => {
    setLoading(true)
    try {
      const [summaryRes, spendingRes] = await Promise.all([
        reportsAPI.monthlySummary(year, month),
        reportsAPI.spendingByCategory(year, month),
      ])
      setSummary(summaryRes.data)
      setSpendingByCategory(spendingRes.data)
    } catch (err) {
      console.error(err)
      alert('Failed to load reports')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Financial Reports</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Select Period</h2>
        <div className="flex gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-2">Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
              className="px-4 py-2 border rounded-lg"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={loadReports}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load Reports'}
          </button>
        </div>
      </div>

      {summary && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-green-100 border border-green-300 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800">Total Income</h3>
              <p className="text-3xl font-bold text-green-900">
                ${summary.income.toFixed(2)}
              </p>
            </div>
            <div className="bg-red-100 border border-red-300 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-800">Total Expenses</h3>
              <p className="text-3xl font-bold text-red-900">
                ${summary.expense.toFixed(2)}
              </p>
            </div>
            <div className="bg-blue-100 border border-blue-300 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800">Net Savings</h3>
              <p className="text-3xl font-bold text-blue-900">
                ${summary.savings.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Spending by Category</h2>
            {Object.keys(spendingByCategory).length === 0 ? (
              <p className="text-gray-600">No spending data for this period.</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(spendingByCategory).map(([catId, amount]: any) => (
                  <div key={catId} className="flex justify-between items-center border-b pb-2">
                    <span className="font-medium">Category {catId.slice(0, 8)}</span>
                    <span className="font-bold text-red-600">${amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
