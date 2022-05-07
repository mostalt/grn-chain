import { GBlock } from '../block/'

export class GChain {
  private _chain: GBlock[]

  constructor() {
    this._chain = [GBlock.genesis()]
  }

  addGBlock(data: unknown) {
    const block = GBlock.mineBlock(this._chain[this._chain.length - 1], data)
    this._chain.push(block)

    return block
  }

  get chain() {
    return this._chain
  }
}
