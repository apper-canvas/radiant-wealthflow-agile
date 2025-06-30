import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  icon, 
  iconColor = 'text-primary-500',
  iconBg = 'bg-primary-50',
  format = 'currency',
  trend = null
}) => {
  const formatValue = (val) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Math.abs(val))
    }
    return val?.toLocaleString() || '0'
  }

  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-success-600'
      case 'negative':
        return 'text-error-600'
      default:
        return 'text-gray-600'
    }
  }

  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive':
        return 'TrendingUp'
      case 'negative':
        return 'TrendingDown'
      default:
        return 'Minus'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="balance-card group"
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-600 group-hover:text-gray-700">
          {title}
        </p>
        <div className={`p-2 rounded-lg ${iconBg} group-hover:scale-110 transition-transform duration-200`}>
          <ApperIcon name={icon} className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-gray-900 gradient-text">
          {formatValue(value)}
        </h3>
        
        {change !== undefined && (
          <div className={`flex items-center space-x-1 text-sm ${getChangeColor()}`}>
            <ApperIcon name={getChangeIcon()} className="w-4 h-4" />
            <span>{Math.abs(change)}% from last month</span>
          </div>
        )}
        
        {trend && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>7-day trend</span>
            </div>
            <div className="h-8 flex items-end space-x-1">
              {trend.map((point, index) => (
                <div
                  key={index}
                  className="flex-1 bg-gradient-to-t from-primary-500 to-primary-300 rounded-sm opacity-60"
                  style={{ height: `${(point / Math.max(...trend)) * 100}%` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default StatCard