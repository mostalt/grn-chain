import { ec } from 'elliptic'

import { getSetting } from '../../utils/settings'
import { ChainUtil } from '../../utils/chain'

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
}
