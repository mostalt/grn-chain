import { GTransactionPool } from '../pool'
import { GTransaction } from '../transaction'
import { GWallet } from './wallet'

describe('Wallet', () => {
  let wallet: GWallet
  let pool: GTransactionPool

  beforeEach(() => {
    wallet = new GWallet()
    pool = new GTransactionPool()
  })

  describe('creating transaction', () => {
    let sendAmount: number
    let recepient: string
    let transaction: GTransaction | undefined

    beforeEach(() => {
      sendAmount = 50
      recepient = '@maM@reCpAJ'
      transaction = wallet.createTransaction(recepient, sendAmount, pool)
    })

    describe('doing the same transaction', () => {
      beforeEach(() => {
        transaction = wallet.createTransaction(recepient, sendAmount, pool)
      })

      it('doubles the `sendAmout` subtracted from the wallet balance', () => {
        expect(transaction?.outputs?.find((output) => output.address === wallet.publicKey)?.amount)
          .toBeDefined()
          .toEqual(wallet.balance - sendAmount * 2)
      })

      it('clones the `sendAmount` output for the recipient', () => {
        expect(
          transaction?.outputs
            .filter(({ address }) => address === recepient)
            .map(({ amount }) => amount),
        )
          .toBeDefined()
          .toEqual([sendAmount, sendAmount])
      })
    })
  })
})
