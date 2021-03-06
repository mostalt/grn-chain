import { GTransactionDTO } from '../../types'
import { GTransaction } from '../../wallet'
import { GBlock } from '../block'

export class GChain {
  private _chain: GBlock[]

  constructor() {
    this._chain = [GBlock.genesis()]
  }

  get chain() {
    return this._chain
  }

  addGBlock(data?: GTransactionDTO[]) {
    const block = GBlock.mineBlock(this._chain[this._chain.length - 1], data ? data : null)
    this._chain.push(block)

    return block
  }

  isValidChain(chain: GBlock[]) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(GBlock.genesis())) {
      return false
    }

    for (let i = 1; i < chain.length; i++) {
      const block = chain[i]
      const lastBlock = chain[i - 1]

      if (block.lastHash !== lastBlock.hash || block.hash !== GBlock.blockHash(block)) {
        return false
      }
    }

    return true
  }

  replaceChain(newChain: GBlock[]) {
    if (newChain.length <= this.chain.length) {
      console.log('Received chain is not longer then the current chain')
      return
    } else if (!this.isValidChain(newChain)) {
      console.log('Received chain is not valid')
      return
    }

    console.log('Replacing blockchain with the new chain')
    this._chain = newChain
  }
}
