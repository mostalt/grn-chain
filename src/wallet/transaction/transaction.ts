import { ChainUtil } from '../../utils/chain'
import { TransactionOutput } from '../../types'
import { GWallet } from '../wallet/'

export class GTransaction {
  private _id: string
  private _input: null
  private _outputs: TransactionOutput[]

  constructor() {
    this._id = ChainUtil.id()
    this._input = null
    this._outputs = []
  }

  static newTransaction(senderWallet: GWallet, recipient: string, amount: number) {
    const transaction = new this()

    if (amount > senderWallet.balance) {
      console.log(`Amount: ${amount} exceeds balance`)
      return
    }

    transaction.addOutput([
      { amount: senderWallet.balance - amount, address: senderWallet.publicKey },
      { amount, address: recipient },
    ])

    return transaction
  }

  get outputs() {
    return this._outputs
  }

  public addOutput(items: TransactionOutput[]) {
    if (items && items.length) {
      this._outputs.push(...items)
      console.log('Ouput added')
    }
  }
}
