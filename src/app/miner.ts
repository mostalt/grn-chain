import { P2PServer } from './p2p'
import { GTransactionPool, GWallet } from '../wallet'
import { GChain } from '../blockchain/chain'

export class Miner {
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
    // get valid transaction
    // include a reward for the miner
    // create block consisting of valid transactions
    // synchronize the chains in the p2p server
    // clear the trasaction pool
    // broadcast to every miner to clear their transaction pools
  }
}