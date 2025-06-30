import { useState } from 'react'
import { motion } from 'framer-motion'
import BudgetGrid from '@/components/organisms/BudgetGrid'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import { budgetService } from '@/services/api/budgetService'
import { categoryService } from '@/services/api/categoryService'
import { toast } from 'react-toastify'

const Budgets = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingBudget, setEditingBudget] = useState(null)
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    category: '',
    limit: '',
    period: 'monthly'
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useState(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const categoriesRes = await categoryService.getAll()
      setCategories(categoriesRes.filter(c => c.type === 'expense'))
    } catch (error) {
      toast.error('Failed to load categories')
    }
  }

  const handleAddBudget = () => {
    setEditingBudget(null)
    setFormData({ category: '', limit: '', period: 'monthly' })
    setShowForm(true)
  }

  const handleEditBudget = (budget) => {
    setEditingBudget(budget)
    setFormData({
      category: budget.category,
      limit: budget.limit.toString(),
      period: budget.period
    })
    setShowForm(true)
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.category) {
      newErrors.category = 'Category is required'
    }
    if (!formData.limit || parseFloat(formData.limit) <= 0) {
      newErrors.limit = 'Budget limit must be greater than 0'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    try {
      const budgetData = {
        category: formData.category,
        limit: parseFloat(formData.limit),
        period: formData.period,
        spent: 0,
        startDate: new Date().toISOString()
      }
      
      if (editingBudget) {
        await budgetService.update(editingBudget.Id, budgetData)
        toast.success('Budget updated successfully')
      } else {
        await budgetService.create(budgetData)
        toast.success('Budget created successfully')
      }
      
      setShowForm(false)
      setEditingBudget(null)
    } catch (error) {
      toast.error('Failed to save budget')
    } finally {
      setLoading(false)
    }
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingBudget(null)
    setFormData({ category: '', limit: '', period: 'monthly' })
    setErrors({})
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Budget Management</h1>
          <p className="text-gray-600">Set spending limits and track your progress</p>
        </div>
        <Button
          variant="primary"
          icon="Plus"
          onClick={handleAddBudget}
          className="shadow-lg"
        >
          Create Budget
        </Button>
      </div>

      {/* Budget Form Modal */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingBudget ? 'Edit Budget' : 'Create New Budget'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                icon="X"
                onClick={handleFormCancel}
              />
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <Select
                label="Category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                options={categories.map(cat => ({ 
                  value: cat.name, 
                  label: cat.name 
                }))}
                placeholder="Select category"
                error={errors.category}
              />
              
              <Input
                label="Budget Limit"
                type="number"
                step="0.01"
                placeholder="0.00"
                icon="DollarSign"
                value={formData.limit}
                onChange={(e) => handleChange('limit', e.target.value)}
                error={errors.limit}
              />
              
              <Select
                label="Period"
                value={formData.period}
                onChange={(e) => handleChange('period', e.target.value)}
                options={[
                  { value: 'monthly', label: 'Monthly' },
                  { value: 'yearly', label: 'Yearly' }
                ]}
              />
              
              <div className="flex space-x-4 pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  className="flex-1"
                >
                  {editingBudget ? 'Update Budget' : 'Create Budget'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleFormCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Budget Grid */}
      <BudgetGrid onEdit={handleEditBudget} onAdd={handleAddBudget} />
    </motion.div>
  )
}

export default Budgets