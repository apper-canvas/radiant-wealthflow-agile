import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { accountService } from '@/services/api/accountService'
import { transactionService } from '@/services/api/transactionService'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import { toast } from 'react-toastify'

const AccountsList = ({ onEdit, onAdd }) => {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError('')
    
    try {
      const [accountsRes, transactionsRes] = await Promise.all([
        accountService.getAll(),
        transactionService.getAll()
      ])
      
      // Calculate recent activity for each account
      const accountsWithActivity = accountsRes.map(account => {
        const accountTransactions = transactionsRes
          .filter(t => t.accountId === account.Id.toString())
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 7) // Last 7 transactions for trend
        
        return { 
          ...account, 
          recentTransactions: accountTransactions,
          lastTransaction: accountTransactions[0] || null
        }
      })
      
      setAccounts(accountsWithActivity)
    } catch (err) {
      setError('Failed to load accounts')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (accountId) => {
    if (!window.confirm('Are you sure you want to delete this account?')) return
    
    try {
      await accountService.delete(accountId)
      setAccounts(prev => prev.filter(a => a.Id !== accountId))
      toast.success('Account deleted successfully')
    } catch (err) {
      toast.error('Failed to delete account')
    }
  }

  const getAccountIcon = (type) => {
    switch (type) {
      case 'checking': return 'Banknote'
      case 'savings': return 'PiggyBank'
      case 'credit': return 'CreditCard'
      default: return 'Wallet'
    }
  }

  const getAccountTypeColor = (type) => {
    switch (type) {
      case 'checking': return '#2563EB'
      case 'savings': return '#16A34A'
      case 'credit': return '#DC2626'
      default: return '#6B7280'
    }
  }

  const formatLastActivity = (transaction) => {
    if (!transaction) return 'No recent activity'
    
    const date = new Date(transaction.date)
    const days = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    return `${days} days ago`
  }

  if (loading) return <Loading type="cards" />
  if (error) return <Error message={error} onRetry={loadData} />
  if (accounts.length === 0) return <Empty type="accounts" action={onAdd} actionText="Add Account" />

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {accounts.map((account, index) => (
        <motion.div
          key={account.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="card-premium group relative overflow-hidden"
        >
          {/* Account Type Indicator */}
          <div 
            className="absolute top-0 right-0 w-16 h-16 opacity-10"
            style={{ backgroundColor: getAccountTypeColor(account.type) }}
          />
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ 
                  backgroundColor: `${getAccountTypeColor(account.type)}20`,
                  color: getAccountTypeColor(account.type)
                }}
              >
                <ApperIcon name={getAccountIcon(account.type)} className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{account.name}</h3>
                <p className="text-sm text-gray-500 capitalize">{account.type} Account</p>
              </div>
            </div>
            
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                icon="Edit"
                onClick={() => onEdit?.(account)}
              />
              <Button
                variant="ghost"
                size="sm"
                icon="Trash2"
                onClick={() => handleDelete(account.Id)}
                className="text-error-600 hover:text-error-700 hover:bg-error-50"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                ${Math.abs(account.balance).toLocaleString()}
              </div>
              {account.type === 'credit' && account.balance > 0 && (
                <div className="text-sm text-error-600">Outstanding Balance</div>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                Last activity: {formatLastActivity(account.lastTransaction)}
              </span>
              <span className="text-gray-500 uppercase tracking-wide text-xs">
                {account.currency || 'USD'}
              </span>
            </div>

            {/* Mini trend chart */}
            {account.recentTransactions.length > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>Recent Activity</span>
                  <span>{account.recentTransactions.length} transactions</span>
                </div>
                <div className="h-8 flex items-end space-x-1">
                  {account.recentTransactions.reverse().map((transaction, idx) => (
                    <div
                      key={idx}
                      className="flex-1 rounded-sm"
                      style={{
                        height: `${Math.max(20, Math.min(100, Math.abs(transaction.amount) / 100))}%`,
                        backgroundColor: transaction.type === 'income' 
                          ? '#16A34A40' 
                          : `${getAccountTypeColor(account.type)}40`
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-gray-100">
              <Button
                variant="ghost"
                size="sm"
                icon="ArrowRight"
                iconPosition="right"
                className="w-full justify-between text-primary-600 hover:text-primary-700"
              >
                View Transactions
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
      
      {/* Add Account Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: accounts.length * 0.1 }}
        className="card-premium border-2 border-dashed border-gray-300 hover:border-primary-500 cursor-pointer group"
        onClick={onAdd}
      >
        <div className="flex flex-col items-center justify-center text-center py-12">
          <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
            <ApperIcon name="Plus" className="w-6 h-6 text-primary-500" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Add Account</h3>
          <p className="text-sm text-gray-500">
            Connect your bank accounts to track finances
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default AccountsList