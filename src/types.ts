import { ec } from 'elliptic'

export interface IConfig {
  difficulty: number
  mineRate: number // ms
  initialBalance: number
}

export type TransactionOutput = {
  amount: number
  address: string
}

export type TransactionInput = {
  timestamp: number
  amount: number
  address: string
  signature: ec.Signature
}

export interface IGBlock {
  timestamp: number
  lastHash: string
  hash: string
  data: unknown
  nonce: number
  difficulty: number
}

export type GBlockDTO = {
  _timestamp: number
  _lastHash: string
  _hash: string
  _data: unknown
  _nonce: number
  _difficulty: number
}

export type GTransactionDTO = {
  _id: string
  _input: TransactionInputDTO
  _outputs: TransactionOutputDTO[]
}

export type TransactionOutputDTO = {
  amount: number
  address: string
}

export type TransactionInputDTO = {
  timestamp: number
  amount: 500
  address: string
  signature: ec.Signature
}
