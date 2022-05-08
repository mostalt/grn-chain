import { GTransaction } from './transaction'
import { GWallet } from '../wallet/wallet'

describe('Transaction', () => {
  let wallet: GWallet
  let recipient: string
  let amount: number
  let transaction: GTransaction | undefined

  beforeEach(() => {
    wallet = new GWallet()
    amount = 50
    recipient = 'tEsTRec1pUieNt'
    transaction = GTransaction.newTransaction(wallet, recipient, amount)
  })

  it('outputs the `amount` subtracted from the wallet balance', () => {
    const resultAmount = transaction?.outputs.find(
      (output) => output.address === wallet.publicKey,
    )?.amount

    expect(resultAmount).toEqual(wallet.balance - amount)
  })

  it('outputs the `amount` added to recipient', () => {
    const resultAmout = transaction?.outputs.find((output) => output.address === recipient)?.amount

    expect(resultAmout).toEqual(amount)
  })

  it('inputs the balance of the wallet', () => {
    expect(transaction?.input?.amount).toEqual(wallet.balance)
  })

  it('validates a valid transaction', () => {
    expect(GTransaction.verifyTransaction(transaction)).toBe(true)
  })

  it('invalidate a corrupt transaction', () => {
    // @ts-ignore: just in case
    transaction.outputs[0].amount = 5000
    expect(GTransaction.verifyTransaction(transaction)).toBe(false)
  })

  describe('transacting with an amount the exceeds the balance', () => {
    beforeEach(() => {
      amount = 50000
      transaction = GTransaction.newTransaction(wallet, recipient, amount)
    })

    it('does not create the transaction', () => {
      expect(transaction).toEqual(undefined)
    })
  })
})
