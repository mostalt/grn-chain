// server file
import { GBlock } from './blockchain/block'

const AwesomeGBlock = GBlock.mineBlock(GBlock.genesis(), 'foo')
console.log(AwesomeGBlock.toString())
