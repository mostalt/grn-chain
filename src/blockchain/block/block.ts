import { IGBlock } from '../../types'
import { getSetting } from '../../utils/settings'
import { ChainUtil } from '../../utils/chain'

const DIFFICULTY = getSetting('difficulty')
const MINE_RATE = getSetting('mineRate')

export class GBlock {
  private _timestamp: IGBlock['timestamp']
  private _lastHash: IGBlock['lastHash']
  private _hash: IGBlock['hash']
  private _data: IGBlock['data']
  private _nonce: IGBlock['nonce']
  private _difficulty: IGBlock['difficulty']

  constructor(
    timestamp: IGBlock['timestamp'],
    lastHash: IGBlock['lastHash'],
    hash: IGBlock['hash'],
    data: IGBlock['data'],
    nonce: IGBlock['nonce'],
    difficulty?: IGBlock['difficulty'],
  ) {
    this._timestamp = timestamp
    this._lastHash = lastHash
    this._hash = hash
    this._data = data
    this._nonce = nonce
    this._difficulty = difficulty || DIFFICULTY
  }

  static sliceHash(hash: string) {
    return hash.substring(0, 10)
  }

  static genesis() {
    return new this(420, '-----', '420w@KeUpAnd$M1le', 'Genesis', 0, DIFFICULTY)
  }

  static adjustDifficulty(lastBlock: GBlock, currentTime: IGBlock['timestamp']) {
    const { difficulty } = lastBlock

    return lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1
  }

  static mineBlock(lastBlock: GBlock, data: unknown) {
    let timestamp: IGBlock['timestamp']
    let hash: IGBlock['hash']
    let nonce: IGBlock['nonce'] = 0
    let currentDifficulty = lastBlock.difficulty

    const lastHash = lastBlock.hash

    do {
      nonce++
      timestamp = Date.now()
      currentDifficulty = GBlock.adjustDifficulty(lastBlock, timestamp)
      hash = GBlock.hash(timestamp, lastHash, data, nonce, currentDifficulty)
      // console.log('hash: ', hash)
    } while (hash.substring(0, currentDifficulty) !== '0'.repeat(currentDifficulty))

    return new this(timestamp, lastHash, hash, data, nonce, currentDifficulty)
  }

  static hash(
    timestamp: IGBlock['timestamp'],
    lashHash: IGBlock['lastHash'],
    data: IGBlock['data'],
    nonce: IGBlock['nonce'],
    difficulty: IGBlock['difficulty'],
  ) {
    return ChainUtil.hash(`${timestamp}${lashHash}${data}${nonce}${difficulty}`).toString()
  }

  static blockHash(block: IGBlock) {
    const { timestamp, lastHash, data, nonce, difficulty } = block

    return GBlock.hash(timestamp, lastHash, data, nonce, difficulty)
  }

  get timestamp() {
    return this._timestamp
  }

  get hash() {
    return this._hash
  }

  get lastHash() {
    return this._lastHash
  }
  get nonce() {
    return this._nonce
  }

  get data() {
    return this._data
  }

  get difficulty() {
    return this._difficulty
  }

  toString() {
    return `GBlock - 
      Timestamp  : ${this._timestamp}
      Last Hash  : ${GBlock.sliceHash(this._lastHash)}
      Hash       : ${GBlock.sliceHash(this._hash)}
      Nonce      : ${this._nonce}
      Difficulty : ${this._difficulty}
      Data       : ${this._data}
    `
  }
}
