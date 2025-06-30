import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Header = ({ onMenuClick }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            icon="Menu"
            onClick={onMenuClick}
            className="lg:hidden"
          />
          
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Good morning! 👋
            </h2>
            <p className="text-sm text-gray-600">{currentDate}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Quick Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              icon="Bell"
              className="relative"
            >
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-error-500 rounded-full"></span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              icon="Settings"
            />
          </div>

          {/* Quick Add Transaction */}
          <Button
            variant="primary"
            size="sm"
            icon="Plus"
            className="shadow-lg"
          >
            <span className="hidden sm:inline">Add Transaction</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header