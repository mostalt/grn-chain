import { TransactionInput } from '../../types'
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
    transaction = wallet.createTransaction('pUpURec1piEnt', 30, pool)
  })

  it('add a transaction to the pool', () => {
    expect(pool.transactions.find(({ id }) => transaction && id === transaction.id)).toEqual(
      transaction,
    )
  })

  it('updates a transaction in the pool', () => {
    const oldTransaction = JSON.stringify(transaction)
    const newTransaction = transaction?.update(wallet, 'aN0thErUzr', 40)

    pool.updateOrAddTransaction(newTransaction)

    const current = JSON.stringify(
      pool.transactions.find(({ id }) => newTransaction && id === newTransaction.id),
    )

    expect(current).not.toEqual(oldTransaction)
  })

  describe('mixing valid and corrupt transactions', () => {
    let validTransactions: GTransaction[]

    beforeEach(() => {
      validTransactions = [...pool.transactions]

      for (let i = 0; i < 6; i++) {
        wallet = new GWallet()
        transaction = wallet.createTransaction('pUpURec1piEnt', 30, pool)

        if (!transaction) {
          return
        }

        if (2 % i === 0) {
          transaction.addInput({
            ...(transaction.input as TransactionInput),
            amount: 99999,
          })
        } else {
          validTransactions.push(transaction)
        }
      }
    })

    it('shows a difference between valid and corrupt transactions', () => {
      expect(JSON.stringify(pool.transactions)).not.toEqual(JSON.stringify(validTransactions))
    })

    it('grabs valid transactions', () => {
      expect(pool.validTransactions()).toEqual(validTransactions)
    })
  })
})
