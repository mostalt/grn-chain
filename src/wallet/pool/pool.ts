import { GTransaction } from '../transaction'

export class GTransactionPool {
  private _transactions: GTransaction[]

  constructor() {
    this._transactions = []
  }

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

  validTransactions() {
    return this._transactions.filter((t) => {
      const { input, outputs } = t

      const outputTotal = outputs.reduce<number>((acc, { amount }) => {
        return acc + amount
      }, 0)

      if (!input) {
        console.log('input is null or undefined')
        return
      }

      if (input.amount !== outputTotal) {
        console.log(`Invalid transaction from ${input.address}`)
        return
      }

      if (!GTransaction.verifyTransaction(t)) {
        console.log(`Invalid signature from ${input.address}`)
        return
      }

      return t
    })
  }
}
