import { getSetting } from '../../utils/settings'
import { GWallet } from '../wallet/wallet'
import { GTransaction } from './transaction'

const MINING_REWARD = getSetting('miningReward')

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

  describe('updation a transaction', () => {
    let nextAmout: number
    let nextRecipient: string

    beforeEach(() => {
      nextAmout = 20
      nextRecipient = 'aN0tHeR420Re(iP1eNt'
      transaction = transaction?.update(wallet, nextRecipient, nextAmout)
    })

    it(`subtracts the next amout from the sender's output`, () => {
      expect(
        transaction?.outputs.find((output) => output.address === wallet.publicKey)?.amount,
      ).toEqual(wallet.balance - amount - nextAmout)
    })

    it('outputs an amount for the next recipient', () => {
      expect(transaction?.outputs.find((output) => output.address === nextRecipient)?.amount).toBe(
        nextAmout,
      )
    })
  })

  describe('creating a reward transaction', () => {
    beforeEach(() => {
      transaction = GTransaction.rewardTransaction(wallet, GWallet.blockchainWallet())
    })

    it(`reward the miners's wallet`, () => {
      expect(
        transaction?.outputs.find((output) => output.address === wallet.publicKey)?.amount,
      ).toEqual(MINING_REWARD)
    })
  })
})
