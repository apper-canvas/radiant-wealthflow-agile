import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { budgetService } from '@/services/api/budgetService'
import { transactionService } from '@/services/api/transactionService'
import { categoryService } from '@/services/api/categoryService'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import { toast } from 'react-toastify'

const BudgetGrid = ({ onEdit, onAdd }) => {
  const [budgets, setBudgets] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError('')
    
    try {
      const [budgetsRes, categoriesRes, transactionsRes] = await Promise.all([
        budgetService.getAll(),
        categoryService.getAll(),
        transactionService.getAll()
      ])
      
      // Calculate spent amounts for each budget
      const budgetsWithSpent = budgetsRes.map(budget => {
        const categoryTransactions = transactionsRes.filter(t => 
          t.category === budget.category && t.type === 'expense'
        )
        const spent = categoryTransactions.reduce((sum, t) => sum + t.amount, 0)
        return { ...budget, spent }
      })
      
      setBudgets(budgetsWithSpent)
      setCategories(categoriesRes)
    } catch (err) {
      setError('Failed to load budgets')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (budgetId) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) return
    
    try {
      await budgetService.delete(budgetId)
      setBudgets(prev => prev.filter(b => b.Id !== budgetId))
      toast.success('Budget deleted successfully')
    } catch (err) {
      toast.error('Failed to delete budget')
    }
  }

  const getCategoryIcon = (categoryName) => {
    const category = categories.find(c => c.name === categoryName)
    return category?.icon || 'Target'
  }

  const getCategoryColor = (categoryName) => {
    const category = categories.find(c => c.name === categoryName)
    return category?.color || '#6B7280'
  }

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'bg-error-500'
    if (percentage >= 80) return 'bg-warning-500'
    return 'bg-success-500'
  }

  const getProgressStatus = (spent, limit) => {
    const percentage = (spent / limit) * 100
    if (percentage >= 100) return 'Over Budget'
    if (percentage >= 80) return 'Nearly Exceeded'
    return 'On Track'
  }

  const getStatusColor = (spent, limit) => {
    const percentage = (spent / limit) * 100
    if (percentage >= 100) return 'text-error-600'
    if (percentage >= 80) return 'text-warning-600'
    return 'text-success-600'
  }

  if (loading) return <Loading type="cards" />
  if (error) return <Error message={error} onRetry={loadData} />
  if (budgets.length === 0) return <Empty type="budgets" action={onAdd} actionText="Create Budget" />

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {budgets.map((budget, index) => {
        const percentage = Math.min((budget.spent / budget.limit) * 100, 100)
        const remaining = Math.max(budget.limit - budget.spent, 0)
        
        return (
          <motion.div
            key={budget.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card-premium group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ 
                    backgroundColor: `${getCategoryColor(budget.category)}20`,
                    color: getCategoryColor(budget.category)
                  }}
                >
                  <ApperIcon name={getCategoryIcon(budget.category)} className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{budget.category}</h3>
                  <p className="text-sm text-gray-500 capitalize">{budget.period}</p>
                </div>
              </div>
              
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  icon="Edit"
                  onClick={() => onEdit?.(budget)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  icon="Trash2"
                  onClick={() => handleDelete(budget.Id)}
                  className="text-error-600 hover:text-error-700 hover:bg-error-50"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">
                  ${budget.spent.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500">
                  of ${budget.limit.toLocaleString()}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className={getStatusColor(budget.spent, budget.limit)}>
                    {getProgressStatus(budget.spent, budget.limit)}
                  </span>
                  <span className="text-gray-500">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className={`h-2 rounded-full ${getProgressColor(percentage)}`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  Remaining: ${remaining.toLocaleString()}
                </span>
                <div className="flex items-center space-x-1 text-gray-500">
                  <ApperIcon name="Calendar" className="w-4 h-4" />
                  <span>This {budget.period.replace('ly', '')}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )
      })}
      
      {/* Add Budget Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: budgets.length * 0.1 }}
        className="card-premium border-2 border-dashed border-gray-300 hover:border-primary-500 cursor-pointer group"
        onClick={onAdd}
      >
        <div className="flex flex-col items-center justify-center text-center py-8">
          <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
            <ApperIcon name="Plus" className="w-6 h-6 text-primary-500" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Create Budget</h3>
          <p className="text-sm text-gray-500">
            Set spending limits for your categories
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default BudgetGrid