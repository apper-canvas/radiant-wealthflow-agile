import accountData from '@/services/mockData/accounts.json'

class AccountService {
  constructor() {
    this.accounts = [...accountData]
  }

  async getAll() {
    await this.delay(250)
    return [...this.accounts]
  }

  async getById(id) {
    await this.delay(200)
    const account = this.accounts.find(a => a.Id === parseInt(id))
    if (!account) {
      throw new Error('Account not found')
    }
    return { ...account }
  }

  async create(accountData) {
    await this.delay(350)
    const newAccount = {
      ...accountData,
      Id: this.getNextId()
    }
    this.accounts.push(newAccount)
    return { ...newAccount }
  }

  async update(id, accountData) {
    await this.delay(300)
    const index = this.accounts.findIndex(a => a.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Account not found')
    }
    this.accounts[index] = { ...this.accounts[index], ...accountData }
    return { ...this.accounts[index] }
  }

  async delete(id) {
    await this.delay(250)
    const index = this.accounts.findIndex(a => a.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Account not found')
    }
    this.accounts.splice(index, 1)
    return true
  }

  getNextId() {
    return Math.max(...this.accounts.map(a => a.Id), 0) + 1
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const accountService = new AccountService()