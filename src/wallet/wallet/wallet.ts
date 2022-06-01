import { ec } from 'elliptic'

import { getSetting } from '../../utils/settings'
import { ChainUtil } from '../../utils/chain'
import { GTransactionPool } from '../pool'
import { GTransaction } from '../transaction'
import { GChain } from 'src/blockchain/chain'
import { GTransactionDTO } from 'src/types'

const INITIAL_BALANCE = getSetting('initialBalance')

export class GWallet {
  private _balance: number // TODO: use bigInt
  private _publicKey: string
  private _keyPair: ec.KeyPair

  constructor() {
    this._balance = INITIAL_BALANCE
    this._keyPair = ChainUtil.genKeyPair()
    this._publicKey = this._keyPair.getPublic().encode('hex', false)
  }

  static blockchainWallet() {
    const wallet = new this()
    wallet.setBlockchainPublicKey()

    return wallet
  }

  private _calculateBalance(chain: GChain) {
    let balance = this._balance
    let transactions: GTransactionDTO[] = []

    chain.chain.forEach((block) => {
      block.data?.forEach((transaction) => {
        transactions.push(transaction)
      })
    })

    const walletInputTs = transactions.filter(
      (transaction) => transaction._input.address === this._publicKey,
    )

    let startTime = 0

    if (walletInputTs.length) {
      const recentInputT = walletInputTs.reduce((prev, current) =>
        prev._input.timestamp > current._input.timestamp ? prev : current,
      )

      const currentBalance = recentInputT._outputs.find(
        (output) => output.address === this._publicKey,
      )?.amount

      if (currentBalance) {
        balance = currentBalance
        startTime = recentInputT._input.timestamp
      }
    }

    transactions.forEach((transaction) => {
      if (transaction._input.timestamp > startTime) {
        transaction._outputs.find((output) => {
          if (output.address === this._publicKey) {
            balance += output.amount
          }
        })
      }
    })

    return balance
  }

  get balance() {
    return this._balance
  }

  get publicKey() {
    return this._publicKey
  }

  public toString() {
    return `Wallet -
			publicKey : ${this._publicKey.toString()}
			balance   : ${this._balance}
		`
  }

  public sign(hash: string) {
    return this._keyPair.sign(hash)
  }

  public createTransaction(
    recipient: string,
    amount: number,
    chain: GChain,
    pool: GTransactionPool,
  ) {
    this._balance = this._calculateBalance(chain)

    if (amount > this._balance) {
      console.log(`Amount: ${amount} exceeds current banalce: ${this._balance}`)
      return
    }

    let transaction = pool.existingTransaction(this._publicKey)

    if (transaction) {
      transaction.update(this, recipient, amount)
    } else {
      transaction = GTransaction.newTransaction(this, recipient, amount)
      pool.updateOrAddTransaction(transaction)
    }

    return transaction
  }

  setBlockchainPublicKey() {
    this._publicKey = 'blckchnwllt'
  }
}
