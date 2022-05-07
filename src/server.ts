// server file
import { Block } from './block'

const AwesomeBlock = Block.mineBlock(Block.genesis(), 'foo')
console.log(AwesomeBlock.toString())
