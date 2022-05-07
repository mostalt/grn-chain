import { GBlock } from '../block'
import { GChain } from './chain'

describe('Chain', () => {
  let blockChain: GChain
  let twoChain: GChain

  beforeEach(() => {
    blockChain = new GChain()
    twoChain = new GChain()
  })

  it('start with genesis block', () => {
    expect(blockChain.chain[0]).toEqual(GBlock.genesis())
  })

  it('adds a new block', () => {
    const data = 'some data'
    blockChain.addGBlock(data)

    expect(blockChain.chain[blockChain.chain.length - 1].data).toEqual(data)
  })

  it('validates a valid chain', () => {
    twoChain.addGBlock('2ChainBlock')
    expect(blockChain.isValidChain(twoChain.chain)).toBe(true)
  })

  it('replaces the chain with a valid chain', () => {
    twoChain.addGBlock('anyNewBlock')
    blockChain.replaceChain(twoChain.chain)

    expect(blockChain.chain).toEqual(twoChain.chain)
  })

  it('does not replace the chain with one of less than or equal to length', () => {
    blockChain.addGBlock('some data')
    blockChain.replaceChain(twoChain.chain)

    expect(blockChain.chain).not.toEqual(twoChain.chain)
  })
})
