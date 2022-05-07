import SHA256 from 'crypto-js/sha256'

export interface IGBlock {
  timestamp: number
  lastHash: string
  hash: string
  data: unknown
}

export class GBlock {
  private _timestamp: IGBlock['timestamp']
  private _lastHash: IGBlock['lastHash']
  private _hash: IGBlock['hash']
  private _data: IGBlock['data']

  static sliceHash(hash: string) {
    return hash.substring(0, 10)
  }

  static genesis() {
    return new this(420, '-----', '420w@KeUpAnd$M1le', [])
  }

  static mineBlock(lastBlock: GBlock, data: unknown) {
    const timestamp = Date.now()
    const lastHash = lastBlock.hash
    const hash = GBlock.hash(timestamp, lastHash, data)

    return new this(timestamp, lastHash, hash, data)
  }

  static hash(timestamp: number, lashHash: string, data: unknown) {
    return SHA256(`${timestamp}${lashHash}${data}`).toString()
  }

  static blockHash(block: GBlock) {
    const { timestamp, lastHash, data } = block

    return GBlock.hash(timestamp, lastHash, data)
  }

  constructor(
    timestamp: IGBlock['timestamp'],
    lastHash: IGBlock['lastHash'],
    hash: IGBlock['hash'],
    data: IGBlock['data'],
  ) {
    this._timestamp = timestamp
    this._lastHash = lastHash
    this._hash = hash
    this._data = data
  }

  get timestamp() {
    return this._timestamp
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
    return `GBlock - 
      Timestamp: ${this._timestamp}
      Last Hash: ${GBlock.sliceHash(this._lastHash)}
      Hash     : ${GBlock.sliceHash(this._hash)}
      Data     : ${this._data}
    `
  }
}
