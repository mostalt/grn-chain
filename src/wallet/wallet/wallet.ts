import { ec } from 'elliptic'

import { getSetting } from '../../utils/settings'
import { ChainUtil } from '../../utils/chain'
import { GTransactionPool } from '../pool'
import { GTransaction } from '../transaction'

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

  public createTransaction(recipient: string, amount: number, pool: GTransactionPool) {
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
