import { motion } from 'framer-motion'
import { NavLink, useLocation } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'

const Sidebar = ({ mobile = false, onClose }) => {
  const location = useLocation()
  
  const menuItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: 'LayoutDashboard',
      description: 'Overview of your finances'
    },
    {
      name: 'Transactions',
      path: '/transactions',
      icon: 'Receipt',
      description: 'Track your spending'
    },
    {
      name: 'Budgets',
      path: '/budgets',
      icon: 'Target',
      description: 'Manage your budgets'
    },
    {
      name: 'Accounts',
      path: '/accounts',
      icon: 'CreditCard',
      description: 'Bank accounts'
    }
  ]

  const handleNavClick = () => {
    if (mobile && onClose) {
      onClose()
    }
  }

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-green-500 rounded-lg flex items-center justify-center">
            <ApperIcon name="Wallet" className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold gradient-text">WealthFlow</h1>
        </div>
        
        {mobile && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ApperIcon name="X" className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                }`
              }
            >
              {({ isActive }) => (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center space-x-3 w-full"
                >
                  <ApperIcon
                    name={item.icon}
                    className={`w-5 h-5 ${
                      isActive ? 'text-white' : 'text-gray-500 group-hover:text-primary-500'
                    }`}
                  />
                  <div className="flex-1">
                    <div className={`font-medium ${isActive ? 'text-white' : ''}`}>
                      {item.name}
                    </div>
                    <div className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                      {item.description}
                    </div>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="w-2 h-2 bg-white rounded-full"
                      initial={false}
                    />
                  )}
                </motion.div>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-r from-primary-50 to-green-50 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-1">Financial Wellness</h3>
          <p className="text-sm text-gray-600 mb-3">
            Track your progress toward financial freedom
          </p>
          <div className="flex items-center space-x-2 text-xs text-primary-600">
            <ApperIcon name="TrendingUp" className="w-4 h-4" />
            <span>You're on track!</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar