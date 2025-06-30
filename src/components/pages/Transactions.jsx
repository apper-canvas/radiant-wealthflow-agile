import { useState } from 'react'
import { motion } from 'framer-motion'
import { transactionService } from '@/services/api/transactionService'
import { accountService } from '@/services/api/accountService'
import { categoryService } from '@/services/api/categoryService'
import TransactionList from '@/components/organisms/TransactionList'
import TransactionForm from '@/components/molecules/TransactionForm'
import SearchBar from '@/components/molecules/SearchBar'
import Button from '@/components/atoms/Button'
import { toast } from 'react-toastify'

const Transactions = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [searchFilters, setSearchFilters] = useState({})
  const [accounts, setAccounts] = useState([])
  const [categories, setCategories] = useState([])

  useState(() => {
    loadFormData()
  }, [])

  const loadFormData = async () => {
    try {
      const [accountsRes, categoriesRes] = await Promise.all([
        accountService.getAll(),
        categoryService.getAll()
      ])
      setAccounts(accountsRes)
      setCategories(categoriesRes)
    } catch (error) {
      toast.error('Failed to load form data')
    }
  }

  const handleAddTransaction = () => {
    setEditingTransaction(null)
    setShowForm(true)
  }

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction)
    setShowForm(true)
  }

  const handleFormSave = () => {
    setShowForm(false)
    setEditingTransaction(null)
    // Transaction list will refresh automatically
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingTransaction(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Transactions</h1>
          <p className="text-gray-600">Track and manage all your financial transactions</p>
        </div>
        <Button
          variant="primary"
          icon="Plus"
          onClick={handleAddTransaction}
          className="shadow-lg"
        >
          Add Transaction
        </Button>
      </div>

      {/* Search and Filters */}
      <SearchBar
        onSearch={setSearchFilters}
        categories={categories}
        accounts={accounts}
        placeholder="Search transactions by description, category, or amount..."
      />

      {/* Transaction Form Modal */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                icon="X"
                onClick={handleFormCancel}
              />
            </div>
            
            <TransactionForm
              transaction={editingTransaction}
              onSave={handleFormSave}
              onCancel={handleFormCancel}
            />
          </motion.div>
        </motion.div>
      )}

      {/* Transactions List */}
      <TransactionList
        searchFilters={searchFilters}
        onEdit={handleEditTransaction}
        showAll={true}
      />
    </motion.div>
  )
}

export default Transactions