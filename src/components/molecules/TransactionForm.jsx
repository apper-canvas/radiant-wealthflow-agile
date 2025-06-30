import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Button from '@/components/atoms/Button'
import { transactionService } from '@/services/api/transactionService'
import { accountService } from '@/services/api/accountService'
import { categoryService } from '@/services/api/categoryService'
import { toast } from 'react-toastify'

const TransactionForm = ({ transaction = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: '',
    accountId: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    recurring: false
  })
  
  const [accounts, setAccounts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    loadFormData()
    if (transaction) {
      setFormData({
        ...transaction,
        date: new Date(transaction.date).toISOString().split('T')[0]
      })
    }
  }, [transaction])

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

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount is required and must be greater than 0'
    }
    if (!formData.category) {
      newErrors.category = 'Category is required'
    }
    if (!formData.accountId) {
      newErrors.accountId = 'Account is required'
    }
    if (!formData.date) {
      newErrors.date = 'Date is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date).toISOString()
      }
      
      if (transaction) {
        await transactionService.update(transaction.Id, transactionData)
        toast.success('Transaction updated successfully')
      } else {
        await transactionService.create(transactionData)
        toast.success('Transaction added successfully')
      }
      
      onSave?.()
    } catch (error) {
      toast.error('Failed to save transaction')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const filteredCategories = categories.filter(cat => cat.type === formData.type)

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          icon="DollarSign"
          value={formData.amount}
          onChange={(e) => handleChange('amount', e.target.value)}
          error={errors.amount}
        />
        
        <Select
          label="Type"
          value={formData.type}
          onChange={(e) => handleChange('type', e.target.value)}
          options={[
            { value: 'income', label: 'Income' },
            { value: 'expense', label: 'Expense' }
          ]}
          error={errors.type}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Category"
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          options={filteredCategories.map(cat => ({ 
            value: cat.name, 
            label: cat.name 
          }))}
          placeholder="Select category"
          error={errors.category}
        />
        
        <Select
          label="Account"
          value={formData.accountId}
          onChange={(e) => handleChange('accountId', e.target.value)}
          options={accounts.map(acc => ({ 
            value: acc.Id.toString(), 
            label: acc.name 
          }))}
          placeholder="Select account"
          error={errors.accountId}
        />
      </div>
      
      <Input
        label="Date"
        type="date"
        value={formData.date}
        onChange={(e) => handleChange('date', e.target.value)}
        error={errors.date}
      />
      
      <Input
        label="Description"
        placeholder="Transaction description (optional)"
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
      />
      
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="recurring"
          checked={formData.recurring}
          onChange={(e) => handleChange('recurring', e.target.checked)}
          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
        />
        <label htmlFor="recurring" className="text-sm font-medium text-gray-700">
          Recurring transaction
        </label>
      </div>
      
      <div className="flex space-x-4 pt-4">
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className="flex-1"
        >
          {transaction ? 'Update Transaction' : 'Add Transaction'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </motion.form>
  )
}

export default TransactionForm