import { getSetting } from '../../utils/settings'
import { GChain } from '../../blockchain/chain'
import { GTransactionPool } from '../pool'
import { GTransaction } from '../transaction'
import { GWallet } from './wallet'

const INITIAL_BALANCE = getSetting('initialBalance')

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

  describe('calculating a balance', () => {
    let addBalance = 1,
      repeatAdd = 1,
      senderWallet: GWallet

    beforeEach(() => {
      senderWallet = new GWallet()
      addBalance = 100
      repeatAdd = 3

      for (let i = 0; i < repeatAdd; i++) {
        senderWallet.createTransaction(wallet.publicKey, addBalance, chain, pool)
      }

      chain.addGBlock(pool.transactions.map((transaction) => transaction.toDto()))
    })

    it('calculates the balance for blockchain transactions matching the recipient', () => {
      expect(wallet.calculateBalance(chain)).toEqual(INITIAL_BALANCE + addBalance * repeatAdd)
    })

    it('calculates the balance for blockchain transactions matching the sender', () => {
      expect(senderWallet.calculateBalance(chain)).toEqual(INITIAL_BALANCE - addBalance * repeatAdd)
    })

    describe('and the recipient condcuts a transaction', () => {
      let subtractBalance = 0
      let recepientBalance = 0

      beforeEach(() => {
        pool.clear()

        subtractBalance = 60
        recepientBalance = wallet.calculateBalance(chain)
        wallet.createTransaction(senderWallet.publicKey, subtractBalance, chain, pool)
        chain.addGBlock(pool.transactions.map((item) => item.toDto()))
      })

      describe('end the sender sends another transaction to the recipient', () => {
        beforeEach(() => {
          pool.clear()
          senderWallet.createTransaction(wallet.publicKey, addBalance, chain, pool)
          chain.addGBlock(pool.transactions.map((item) => item.toDto()))
        })

        it('calculate the recipient balance only using transactions since its most recent one', () => {
          expect(wallet.calculateBalance(chain)).toEqual(
            recepientBalance - subtractBalance + addBalance,
          )
        })
      })
    })
  })
})
