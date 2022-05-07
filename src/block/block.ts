import SHA256 from 'crypto-js/sha256'

export interface IBlock {
  timestamp: number | string
  lastHash: string
  hash: string
  data: unknown
}

export class Block {
  private _timestamp: IBlock['timestamp']
  private _lastHash: IBlock['lastHash']
  private _data: IBlock['data']

  private _hash: IBlock['hash']

  static sliceHash(hash: string) {
    return hash.substring(0, 10)
  }

  static genesis() {
    return new this('Genesis time', '-----', '420waKeUpAndsMile', [])
  }

  static mineBlock(lastBlock: Block, data: unknown) {
    const timestamp = Date.now()
    const lastHash = lastBlock.hash
    const hash = Block.hash(timestamp, lastHash, data)

    return new this(timestamp, lastHash, hash, data)
  }

  static hash(timestamp: number, lashHash: string, data: unknown) {
    return SHA256(`${timestamp}${lashHash}${data}`).toString()
  }

  constructor(
    timestamp: IBlock['timestamp'],
    lastHash: IBlock['lastHash'],
    hash: IBlock['hash'],
    data: IBlock['data'],
  ) {
    this._timestamp = timestamp
    this._lastHash = lastHash
    this._hash = hash
    this._data = data
  }

  get hash() {
    return this._hash
  }

  get data() {
    return this._data
  }

  get lastHash() {
    return this._lastHash
  }

  toString() {
    return `Block - 
      Timestamp: ${this._timestamp}
      Last Hash: ${Block.sliceHash(this._lastHash)}
      Hash     : ${Block.sliceHash(this._hash)}
      Data     : ${this._data}
    `
  }
}
