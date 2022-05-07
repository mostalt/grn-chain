import { GBlock } from '../block'
import { GChain } from './chain'

describe('Chain', () => {
  let blockChain: GChain

  beforeEach(() => {
    blockChain = new GChain()
  })

  it('start with genesis block', () => {
    expect(blockChain.chain[0]).toEqual(GBlock.genesis())
  })

  it('adds a new block', () => {
    const data = 'some data'
    blockChain.addGBlock(data)

    expect(blockChain.chain[blockChain.chain.length - 1].data).toEqual(data)
  })
})
