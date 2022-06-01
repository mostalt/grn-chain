import { P2PServer } from './p2p'
import { GTransaction, GTransactionPool, GWallet } from '../wallet'
import { GChain } from '../blockchain/chain'

export class GMiner {
  private _chain: GChain
  private _pool: GTransactionPool
  private _wallet: GWallet
  private _p2p: P2PServer

  constructor(chain: GChain, pool: GTransactionPool, wallet: GWallet, p2p: P2PServer) {
    this._chain = chain
    this._pool = pool
    this._wallet = wallet
    this._p2p = p2p
  }

  mine() {
    const validTransactions = this._pool.validTransactions()
    validTransactions.push(GTransaction.rewardTransaction(this._wallet, GWallet.blockchainWallet()))
    const block = this._chain.addGBlock(validTransactions.map((transaction) => transaction.toDto()))
    this._p2p.syncChains()
    this._pool.clear()
    this._p2p.broadcastClearTransactions()

    return block
  }
}
