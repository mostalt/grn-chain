import { GTransaction } from '../transaction'

export class GTransactionPool {
  constructor() {
    this._transactions = []
  }

  private _transactions: GTransaction[]

  get transactions() {
    return this._transactions
  }

  updateOrAddTransaction(transaction: GTransaction | undefined) {
    if (!transaction) return

    const transactionWithId = this._transactions.find((t) => t.id === transaction.id)

    if (transactionWithId) {
      this._transactions[this._transactions.indexOf(transactionWithId)] = transaction
    } else {
      this._transactions.push(transaction)
    }
  }

  existingTransaction(address: string) {
    return this._transactions.find(({ input }) => input?.address === address)
  }
}
