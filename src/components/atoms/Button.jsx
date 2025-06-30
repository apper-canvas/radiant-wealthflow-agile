import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:shadow-lg hover:scale-105 focus:ring-primary-500',
    secondary: 'bg-white border-2 border-gray-200 text-gray-700 hover:border-primary-500 hover:text-primary-600 hover:shadow-md focus:ring-primary-500',
    success: 'bg-gradient-to-r from-success-500 to-success-600 text-white hover:shadow-lg hover:scale-105 focus:ring-success-500',
    warning: 'bg-gradient-to-r from-warning-500 to-warning-600 text-white hover:shadow-lg hover:scale-105 focus:ring-warning-500',
    error: 'bg-gradient-to-r from-error-500 to-error-600 text-white hover:shadow-lg hover:scale-105 focus:ring-error-500',
    ghost: 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
  }
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }
  
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: variant === 'ghost' ? 1 : 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <ApperIcon 
          name="Loader2" 
          className={`${iconSizes[size]} mr-2 animate-spin`} 
        />
      )}
      
      {icon && iconPosition === 'left' && !loading && (
        <ApperIcon 
          name={icon} 
          className={`${iconSizes[size]} ${children ? 'mr-2' : ''}`} 
        />
      )}
      
      {children}
      
      {icon && iconPosition === 'right' && !loading && (
        <ApperIcon 
          name={icon} 
          className={`${iconSizes[size]} ${children ? 'ml-2' : ''}`} 
        />
      )}
    </motion.button>
  )
}

export default Button