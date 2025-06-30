import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Chart from 'react-apexcharts'
import { transactionService } from '@/services/api/transactionService'
import { accountService } from '@/services/api/accountService'
import { categoryService } from '@/services/api/categoryService'
import StatCard from '@/components/molecules/StatCard'
import TransactionList from '@/components/organisms/TransactionList'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'

const Dashboard = () => {
  const [data, setData] = useState({
    transactions: [],
    accounts: [],
    categories: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    setError('')
    
    try {
      const [transactions, accounts, categories] = await Promise.all([
        transactionService.getAll(),
        accountService.getAll(),
        categoryService.getAll()
      ])
      
      setData({ transactions, accounts, categories })
    } catch (err) {
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = () => {
    const thisMonth = new Date()
    thisMonth.setDate(1)
    
    const monthlyTransactions = data.transactions.filter(t => 
      new Date(t.date) >= thisMonth
    )
    
    const income = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const expenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const totalBalance = data.accounts.reduce((sum, acc) => {
      if (acc.type === 'credit') return sum - acc.balance
      return sum + acc.balance
    }, 0)

    return { income, expenses, totalBalance, netIncome: income - expenses }
  }

  const getSpendingByCategory = () => {
    const thisMonth = new Date()
    thisMonth.setDate(1)
    
    const monthlyExpenses = data.transactions.filter(t => 
      t.type === 'expense' && new Date(t.date) >= thisMonth
    )
    
    const categorySpending = {}
    monthlyExpenses.forEach(t => {
      categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount
    })
    
    return Object.entries(categorySpending)
      .map(([category, amount]) => ({
        category,
        amount,
        color: data.categories.find(c => c.name === category)?.color || '#6B7280'
      }))
      .sort((a, b) => b.amount - a.amount)
  }

  const getMonthlyTrend = () => {
    const last6Months = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      date.setDate(1)
      last6Months.push(date)
    }
    
    return last6Months.map(month => {
      const monthEnd = new Date(month)
      monthEnd.setMonth(monthEnd.getMonth() + 1)
      
      const monthTransactions = data.transactions.filter(t => {
        const transactionDate = new Date(t.date)
        return transactionDate >= month && transactionDate < monthEnd
      })
      
      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)
      
      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)
      
      return {
        month: month.toLocaleDateString('en', { month: 'short' }),
        income,
        expenses
      }
    })
  }

  if (loading) return <Loading type="dashboard" />
  if (error) return <Error message={error} onRetry={loadDashboardData} />

  const stats = calculateStats()
  const categorySpending = getSpendingByCategory()
  const monthlyTrend = getMonthlyTrend()

  const chartOptions = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      sparkline: { enabled: false }
    },
    colors: ['#22C55E', '#EF4444'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.6,
        opacityTo: 0.1
      }
    },
    grid: {
      show: true,
      borderColor: '#F3F4F6'
    },
    xaxis: {
      categories: monthlyTrend.map(d => d.month),
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        formatter: (value) => `$${value.toLocaleString()}`
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right'
    },
    tooltip: {
      y: {
        formatter: (value) => `$${value.toLocaleString()}`
      }
    }
  }

  const chartSeries = [
    {
      name: 'Income',
      data: monthlyTrend.map(d => d.income)
    },
    {
      name: 'Expenses',
      data: monthlyTrend.map(d => d.expenses)
    }
  ]

  const pieChartOptions = {
    chart: {
      type: 'donut'
    },
    colors: categorySpending.map(c => c.color),
    labels: categorySpending.map(c => c.category),
    legend: {
      position: 'bottom'
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%'
        }
      }
    },
    tooltip: {
      y: {
        formatter: (value) => `$${value.toLocaleString()}`
      }
    }
  }

  const pieChartSeries = categorySpending.map(c => c.amount)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Dashboard</h1>
        <p className="text-gray-600">Track your financial health and spending patterns</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Balance"
          value={stats.totalBalance}
          icon="Wallet"
          iconColor="text-primary-500"
          iconBg="bg-primary-50"
          change={8.2}
          changeType="positive"
        />
        <StatCard
          title="Monthly Income"
          value={stats.income}
          icon="TrendingUp"
          iconColor="text-success-500"
          iconBg="bg-success-50"
          change={12.5}
          changeType="positive"
        />
        <StatCard
          title="Monthly Expenses"
          value={stats.expenses}
          icon="TrendingDown"
          iconColor="text-error-500"
          iconBg="bg-error-50"
          change={-3.2}
          changeType="negative"
        />
        <StatCard
          title="Net Income"
          value={stats.netIncome}
          icon="DollarSign"
          iconColor="text-green-500"
          iconBg="bg-green-50"
          change={15.8}
          changeType="positive"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Trend */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Income vs Expenses Trend
          </h3>
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="area"
            height={300}
          />
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Spending by Category
          </h3>
          {categorySpending.length > 0 ? (
            <Chart
              options={pieChartOptions}
              series={pieChartSeries}
              type="donut"
              height={300}
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No expense data available
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <TransactionList />
    </motion.div>
  )
}

export default Dashboard