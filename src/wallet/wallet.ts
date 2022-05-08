import { ec } from 'elliptic'

import { getSetting } from '../utils/settings'
import { ChainUtil } from '../utils/chain'

const INITIAL_BALANCE = getSetting('initialBalance')

export class Wallet {
  private _balance: number
  private _keyPair: ec.KeyPair
  private _publicKey: string

  constructor() {
    this._balance = INITIAL_BALANCE
    this._keyPair = ChainUtil.genKeyPair()
    this._publicKey = this._keyPair.getPublic().encode('hex', false)
  }

  toString() {
    return `Wallet -
			publicKey : ${this._publicKey.toString()}
			balance   : ${this._balance}
		`
  }
}
