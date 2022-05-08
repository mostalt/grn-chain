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
