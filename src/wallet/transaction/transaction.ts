import { ChainUtil } from '../../utils/chain'
import { TransactionOutput, TransactionInput } from '../../types'
import { GWallet } from '../wallet/'

export class GTransaction {
  private _id: string
  private _input: TransactionInput | null
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

    GTransaction.signTransaction(transaction, senderWallet)

    return transaction
  }

  static signTransaction(transaction: GTransaction, senderWallet: GWallet) {
    transaction.addInput({
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(ChainUtil.hash(transaction.outputs)),
    })
  }

  get outputs() {
    return this._outputs
  }

  get input() {
    return this._input
  }

  get id() {
    return this._id
  }

  public addOutput(items: TransactionOutput[]) {
    if (items && items.length) {
      this._outputs.push(...items)
      console.log('Ouput added')
    }
  }

  public addInput(input: TransactionInput) {
    if (input) {
      this._input = input
    }
  }
}
