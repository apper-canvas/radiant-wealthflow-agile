import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = "No data available",
  description = "Get started by adding your first item",
  action,
  actionText = "Add Item",
  icon = "Inbox",
  type = 'default'
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case 'transactions':
        return {
          icon: 'Receipt',
          title: 'No transactions yet',
          description: 'Start tracking your finances by adding your first transaction'
        }
      case 'budgets':
        return {
          icon: 'Target',
          title: 'No budgets created',
          description: 'Create your first budget to start managing your spending'
        }
      case 'accounts':
        return {
          icon: 'CreditCard',
          title: 'No accounts added',
          description: 'Add your bank accounts to start tracking your finances'
        }
      default:
        return { icon, title, description }
    }
  }

  const content = getEmptyContent()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      <div className="bg-gradient-to-br from-primary-50 to-green-50 rounded-full p-6 mb-6">
        <ApperIcon name={content.icon} className="w-12 h-12 text-primary-500" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        {content.title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-sm">
        {content.description}
      </p>
      
      {action && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={action}
          className="btn-primary inline-flex items-center space-x-2"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>{actionText}</span>
        </motion.button>
      )}
    </motion.div>
  )
}

export default Empty