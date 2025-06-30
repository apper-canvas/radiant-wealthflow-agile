import { forwardRef } from 'react'
import ApperIcon from '@/components/ApperIcon'

const Select = forwardRef(({ 
  label,
  options = [],
  placeholder = 'Select an option',
  error,
  helper,
  className = '',
  containerClassName = '',
  ...props 
}, ref) => {
  const selectClasses = `
    input-field appearance-none pr-12 cursor-pointer
    ${error ? 'border-error-500 focus:border-error-500' : ''}
    ${className}
  `

  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        <select
          ref={ref}
          className={selectClasses}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
          <ApperIcon name="ChevronDown" className="w-5 h-5 text-gray-400" />
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-error-600 flex items-center space-x-1">
          <ApperIcon name="AlertCircle" className="w-4 h-4" />
          <span>{error}</span>
        </p>
      )}
      
      {helper && !error && (
        <p className="text-sm text-gray-500">{helper}</p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

export default Select