import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { transactionService } from '@/services/api/transactionService'
import { categoryService } from '@/services/api/categoryService'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import { toast } from 'react-toastify'
import { format } from 'date-fns'

const TransactionList = ({ searchFilters, onEdit, showAll = false }) => {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (searchFilters) {
      filterTransactions()
    }
  }, [searchFilters])

  const loadData = async () => {
    setLoading(true)
    setError('')
    
    try {
      const [transactionsRes, categoriesRes] = await Promise.all([
        transactionService.getAll(),
        categoryService.getAll()
      ])
      
      setTransactions(transactionsRes)
      setCategories(categoriesRes)
    } catch (err) {
      setError('Failed to load transactions')
    } finally {
      setLoading(false)
    }
  }

  const filterTransactions = () => {
    // This would normally filter the transactions based on search criteria
    // For now, we'll just reload the data
    loadData()
  }

  const handleDelete = async (transactionId) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return
    
    try {
      await transactionService.delete(transactionId)
      setTransactions(prev => prev.filter(t => t.Id !== transactionId))
      toast.success('Transaction deleted successfully')
    } catch (err) {
      toast.error('Failed to delete transaction')
    }
  }

  const getCategoryIcon = (categoryName) => {
    const category = categories.find(c => c.name === categoryName)
    return category?.icon || 'DollarSign'
  }

  const getCategoryColor = (categoryName) => {
    const category = categories.find(c => c.name === categoryName)
    return category?.color || '#6B7280'
  }

  const displayTransactions = showAll ? transactions : transactions.slice(0, 5)

  if (loading) return <Loading type="table" />
  if (error) return <Error message={error} onRetry={loadData} />
  if (transactions.length === 0) return <Empty type="transactions" />

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {showAll ? 'All Transactions' : 'Recent Transactions'}
          </h3>
          {!showAll && transactions.length > 5 && (
            <Button variant="ghost" size="sm" icon="ArrowRight">
              View All
            </Button>
          )}
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        <AnimatePresence>
          {displayTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className="p-6 hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ 
                      backgroundColor: `${getCategoryColor(transaction.category)}20`,
                      color: getCategoryColor(transaction.category)
                    }}
                  >
                    <ApperIcon name={getCategoryIcon(transaction.category)} className="w-5 h-5" />
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {transaction.description || transaction.category}
                    </h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{transaction.category}</span>
                      <span>•</span>
                      <span>{format(new Date(transaction.date), 'MMM dd, yyyy')}</span>
                      {transaction.recurring && (
                        <>
                          <span>•</span>
                          <div className="flex items-center space-x-1">
                            <ApperIcon name="Repeat" className="w-3 h-3" />
                            <span>Recurring</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className={`font-semibold ${
                      transaction.type === 'income' 
                        ? 'text-success-600' 
                        : 'text-gray-900'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      ${Math.abs(transaction.amount).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500 capitalize">
                      {transaction.type}
                    </div>
                  </div>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Edit"
                      onClick={() => onEdit?.(transaction)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Trash2"
                      onClick={() => handleDelete(transaction.Id)}
                      className="text-error-600 hover:text-error-700 hover:bg-error-50"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default TransactionList