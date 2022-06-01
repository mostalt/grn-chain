import { GBlock } from './block'

describe('Block', () => {
  let data: null = null
  let lastGBlock: GBlock
  let block: GBlock

  beforeEach(() => {
    data = null
    lastGBlock = GBlock.genesis()
    block = GBlock.mineBlock(lastGBlock, data)
  })

  it('sets the `data` to match the input', () => {
    expect(block.data).toEqual(data)
  })

  it('sets the `lastHash` to match the hash if the last GBlock', () => {
    expect(block.lastHash).toEqual(lastGBlock.hash)
  })

  it('generate a hash that matches the difficulty', () => {
    expect(block.hash.substring(0, block.difficulty)).toEqual('0'.repeat(block.difficulty))
    console.log(block.toString())
  })

  it('lowers the difficulty for slowly mined blocks', () => {
    // add 1 hour
    expect(GBlock.adjustDifficulty(block, block.timestamp + 3600)).toEqual(block.difficulty - 1)
  })

  it('raises the difficulty for quickly mined blocks', () => {
    expect(GBlock.adjustDifficulty(block, block.timestamp + 1)).toEqual(block.difficulty + 1)
  })
})
