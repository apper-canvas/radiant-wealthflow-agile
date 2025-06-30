import { useState } from 'react'
import { motion } from 'framer-motion'
import AccountsList from '@/components/organisms/AccountsList'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import { accountService } from '@/services/api/accountService'
import { toast } from 'react-toastify'

const Accounts = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingAccount, setEditingAccount] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'checking',
    balance: '',
    currency: 'USD',
    color: '#2563EB'
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const accountTypes = [
    { value: 'checking', label: 'Checking Account' },
    { value: 'savings', label: 'Savings Account' },
    { value: 'credit', label: 'Credit Card' }
  ]

  const currencies = [
    { value: 'USD', label: 'US Dollar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'GBP', label: 'British Pound (GBP)' },
    { value: 'CAD', label: 'Canadian Dollar (CAD)' }
  ]

  const accountColors = [
    '#2563EB', '#16A34A', '#DC2626', '#7C3AED', 
    '#EA580C', '#0891B2', '#BE185D', '#4338CA'
  ]

  const handleAddAccount = () => {
    setEditingAccount(null)
    setFormData({
      name: '',
      type: 'checking',
      balance: '',
      currency: 'USD',
      color: '#2563EB'
    })
    setShowForm(true)
  }

  const handleEditAccount = (account) => {
    setEditingAccount(account)
    setFormData({
      name: account.name,
      type: account.type,
      balance: account.balance.toString(),
      currency: account.currency || 'USD',
      color: account.color || '#2563EB'
    })
    setShowForm(true)
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Account name is required'
    }
    if (!formData.balance || isNaN(parseFloat(formData.balance))) {
      newErrors.balance = 'Valid balance amount is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    try {
      const accountData = {
        name: formData.name.trim(),
        type: formData.type,
        balance: parseFloat(formData.balance),
        currency: formData.currency,
        color: formData.color
      }
      
      if (editingAccount) {
        await accountService.update(editingAccount.Id, accountData)
        toast.success('Account updated successfully')
      } else {
        await accountService.create(accountData)
        toast.success('Account added successfully')
      }
      
      setShowForm(false)
      setEditingAccount(null)
    } catch (error) {
      toast.error('Failed to save account')
    } finally {
      setLoading(false)
    }
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingAccount(null)
    setFormData({
      name: '',
      type: 'checking',
      balance: '',
      currency: 'USD',
      color: '#2563EB'
    })
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Management</h1>
          <p className="text-gray-600">Manage your bank accounts and track balances</p>
        </div>
        <Button
          variant="primary"
          icon="Plus"
          onClick={handleAddAccount}
          className="shadow-lg"
        >
          Add Account
        </Button>
      </div>

      {/* Account Form Modal */}
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
                {editingAccount ? 'Edit Account' : 'Add New Account'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                icon="X"
                onClick={handleFormCancel}
              />
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Account Name"
                placeholder="e.g., Chase Checking"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                error={errors.name}
              />
              
              <Select
                label="Account Type"
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                options={accountTypes}
              />
              
              <Input
                label="Current Balance"
                type="number"
                step="0.01"
                placeholder="0.00"
                icon="DollarSign"
                value={formData.balance}
                onChange={(e) => handleChange('balance', e.target.value)}
                error={errors.balance}
                helper={formData.type === 'credit' ? 'Enter outstanding balance (what you owe)' : 'Enter your current account balance'}
              />
              
              <Select
                label="Currency"
                value={formData.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                options={currencies}
              />
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Color
                </label>
                <div className="flex space-x-2">
                  {accountColors.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleChange('color', color)}
                      className={`w-8 h-8 rounded-full transition-all duration-200 ${
                        formData.color === color 
                          ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' 
                          : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  className="flex-1"
                >
                  {editingAccount ? 'Update Account' : 'Add Account'}
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

      {/* Accounts List */}
      <AccountsList onEdit={handleEditAccount} onAdd={handleAddAccount} />
    </motion.div>
  )
}

export default Accounts