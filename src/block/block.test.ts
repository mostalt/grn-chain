import { GBlock } from './block'

describe('Block', () => {
  let data: unknown = 'data'
  let lastGBlock: GBlock
  let block: GBlock

  beforeEach(() => {
    data = 'some data'
    lastGBlock = GBlock.genesis()
    block = GBlock.mineBlock(lastGBlock, data)
  })

  it('sets the `data` to natch the input', () => {
    expect(block.data).toEqual(data)
  })

  it('sets the `lastHash` to match the hash if the last GBlock', () => {
    expect(block.lastHash).toEqual(lastGBlock.hash)
  })
})
