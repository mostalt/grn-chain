import { GTransaction } from '../transaction'
import { GWallet } from '../wallet'
import { GTransactionPool } from './pool'

describe('TransactionPool', () => {
  let pool: GTransactionPool
  let wallet: GWallet
  let transaction: GTransaction | undefined

  beforeEach(() => {
    pool = new GTransactionPool()
    wallet = new GWallet()
    transaction = GTransaction.newTransaction(wallet, 'pUpURec1piEnt', 30)
    pool.updateOrAddTransaction(transaction)
  })

  it('add a transaction to the pool', () => {
    expect(pool.transactions.find(({ id }) => transaction && id === transaction.id))
      .toBeDefined()
      .toEqual(transaction)
  })

  it('updates a transaction in the pool', () => {
    const oldTransaction = JSON.stringify(transaction)
    const newTransaction = transaction?.update(wallet, 'aN0thErUzr', 40)

    if (newTransaction) {
      pool.updateOrAddTransaction(newTransaction)
    }

    expect(
      JSON.stringify(
        pool.transactions.find(({ id }) => newTransaction && id === newTransaction.id),
      ),
    )
      .toBeDefined()
      .not.toEqual(oldTransaction)
  })
})
