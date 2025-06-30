import { useState } from 'react'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const SearchBar = ({ 
  onSearch, 
  onFilter, 
  categories = [],
  accounts = [],
  showDateFilter = true,
  placeholder = "Search transactions..."
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedAccount, setSelectedAccount] = useState('')
  const [dateRange, setDateRange] = useState('')

  const handleSearch = () => {
    onSearch?.({
      term: searchTerm,
      category: selectedCategory,
      account: selectedAccount,
      dateRange
    })
  }

  const handleClear = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setSelectedAccount('')
    setDateRange('')
    onSearch?.({
      term: '',
      category: '',
      account: '',
      dateRange: ''
    })
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <div className="lg:col-span-2">
          <Input
            placeholder={placeholder}
            icon="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        
        <Select
          placeholder="All Categories"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          options={categories.map(cat => ({ value: cat.name, label: cat.name }))}
        />
        
        <Select
          placeholder="All Accounts"
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          options={accounts.map(acc => ({ value: acc.name, label: acc.name }))}
        />
        
        {showDateFilter && (
          <Select
            placeholder="Date Range"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            options={[
              { value: 'today', label: 'Today' },
              { value: 'week', label: 'This Week' },
              { value: 'month', label: 'This Month' },
              { value: 'quarter', label: 'This Quarter' },
              { value: 'year', label: 'This Year' }
            ]}
          />
        )}
        
        <div className="flex space-x-2">
          <Button 
            variant="primary" 
            size="md"
            icon="Search"
            onClick={handleSearch}
            className="flex-1"
          >
            Search
          </Button>
          <Button 
            variant="ghost" 
            size="md"
            icon="X"
            onClick={handleClear}
          />
        </div>
      </div>
    </div>
  )
}

export default SearchBar