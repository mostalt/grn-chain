import { GChain } from '../../blockchain/chain'
import { GTransactionPool } from '../pool'
import { GTransaction } from '../transaction'
import { GWallet } from './wallet'

describe('Wallet', () => {
  let wallet: GWallet
  let pool: GTransactionPool
  let chain: GChain

  beforeEach(() => {
    wallet = new GWallet()
    pool = new GTransactionPool()
    chain = new GChain()
  })

  describe('creating transaction', () => {
    let sendAmount: number
    let recepient: string
    let transaction: GTransaction | undefined

    beforeEach(() => {
      sendAmount = 50
      recepient = '@maM@reCpAJ'
      transaction = wallet.createTransaction(recepient, sendAmount, chain, pool)
    })

    describe('doing the same transaction', () => {
      beforeEach(() => {
        transaction = wallet.createTransaction(recepient, sendAmount, chain, pool)
      })

      it('doubles the `sendAmout` subtracted from the wallet balance', () => {
        expect(
          transaction?.outputs?.find((output) => output.address === wallet.publicKey)?.amount,
        ).toEqual(wallet.balance - sendAmount * 2)
      })

      it('clones the `sendAmount` output for the recipient', () => {
        expect(
          transaction?.outputs
            .filter(({ address }) => address === recepient)
            .map(({ amount }) => amount),
        ).toEqual([sendAmount, sendAmount])
      })
    })
  })
})
