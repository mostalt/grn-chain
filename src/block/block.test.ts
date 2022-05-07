import { Block } from './block'

describe('Block', () => {
  let data: unknown = 'data'
  let lastBlock: Block
  let block: Block

  beforeEach(() => {
    data = 'some data'
    lastBlock = Block.genesis()
    block = Block.mineBlock(lastBlock, data)
  })

  it('sets the `data` to natch the input', () => {
    expect(block.data).toEqual(data)
  })

  it('sets the `lastHash` to match the hash if the last block', () => {
    expect(block.lastHash).toEqual(lastBlock.hash)
  })
})
