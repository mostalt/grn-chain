import { GChain } from './blockchain/chain'

const BLOCK_COUNT = 10

const blockChain = new GChain()

for (let i = 0; i < BLOCK_COUNT; i++) {
  console.log(blockChain.addGBlock(`block number ${i}`).toString())
}
