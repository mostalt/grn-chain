import { ChainUtil } from '../../utils/chain'
import { GWallet } from '../wallet/'
import { TransactionOutput, TransactionInput, TransactionOutputDTO } from '../../types'
import { getSetting } from '../../utils/settings'

const MINING_REWARD = getSetting('miningReward')

export class GTransaction {
  private _id: string
  private _input: TransactionInput | null
  private _outputs: TransactionOutput[]

  constructor(id?: string, input?: TransactionInput, outputs?: TransactionOutputDTO[]) {
    this._id = id || ChainUtil.id()
    this._input = input || null
    this._outputs = outputs || []
  }

  static transactionWithOutput(senderWallet: GWallet, outputs: TransactionOutput[]) {
    const transaction = new this()

    transaction.outputs.push(...outputs)
    GTransaction.signTransaction(transaction, senderWallet)

    return transaction
  }

  static newTransaction(senderWallet: GWallet, recipient: string, amount: number) {
    if (amount > senderWallet.balance) {
      console.log(`Amount: ${amount} exceeds balance`)
      return
    }

    return GTransaction.transactionWithOutput(senderWallet, [
      { amount: senderWallet.balance - amount, address: senderWallet.publicKey },
      { amount, address: recipient },
    ])
  }

  static rewardTransaction(minerWallet: GWallet, blockchainWallet: GWallet) {
    return GTransaction.transactionWithOutput(blockchainWallet, [
      {
        amount: MINING_REWARD,
        address: minerWallet.publicKey,
      },
    ])
  }

  static signTransaction(transaction: GTransaction, senderWallet: GWallet) {
    transaction.addInput({
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(ChainUtil.hash(transaction.outputs)),
    })
  }

  static verifyTransaction(transaction: GTransaction | undefined) {
    if (!transaction || !transaction.input) {
      return false
    }

    return ChainUtil.verifySignature(
      transaction.input.address,
      transaction.input.signature,
      ChainUtil.hash(transaction.outputs),
    )
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

  update(senderWallet: GWallet, recipient: string, amount: number) {
    const senderOutput = this._outputs.find((output) => output.address === senderWallet.publicKey)

    if (!senderOutput) {
      console.log('Output is not defined')
      return
    }

    if (amount > senderOutput.amount) {
      console.log(`Amount: ${amount} exceeds balance`)
      return
    }

    senderOutput.amount = senderOutput.amount - amount
    this._outputs.push({ amount, address: recipient })
    GTransaction.signTransaction(this, senderWallet)

    return this
  }

  public addOutput(items: TransactionOutput[]) {
    if (items && items.length) {
      this._outputs.push(...items)
    }
  }

  public addInput(input: TransactionInput) {
    if (input) {
      this._input = input
    }
  }
}
