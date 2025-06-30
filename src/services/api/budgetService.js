import budgetData from '@/services/mockData/budgets.json'

class BudgetService {
  constructor() {
    this.budgets = [...budgetData]
  }

  async getAll() {
    await this.delay(300)
    return [...this.budgets]
  }

  async getById(id) {
    await this.delay(200)
    const budget = this.budgets.find(b => b.Id === parseInt(id))
    if (!budget) {
      throw new Error('Budget not found')
    }
    return { ...budget }
  }

  async create(budgetData) {
    await this.delay(400)
    const newBudget = {
      ...budgetData,
      Id: this.getNextId(),
      startDate: budgetData.startDate || new Date().toISOString()
    }
    this.budgets.push(newBudget)
    return { ...newBudget }
  }

  async update(id, budgetData) {
    await this.delay(350)
    const index = this.budgets.findIndex(b => b.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Budget not found')
    }
    this.budgets[index] = { ...this.budgets[index], ...budgetData }
    return { ...this.budgets[index] }
  }

  async delete(id) {
    await this.delay(250)
    const index = this.budgets.findIndex(b => b.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Budget not found')
    }
    this.budgets.splice(index, 1)
    return true
  }

  getNextId() {
    return Math.max(...this.budgets.map(b => b.Id), 0) + 1
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const budgetService = new BudgetService()