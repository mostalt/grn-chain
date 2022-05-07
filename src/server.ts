// server file
import { GBlock } from './block'

const AwesomeGBlock = GBlock.mineBlock(GBlock.genesis(), 'foo')
console.log(AwesomeGBlock.toString())
