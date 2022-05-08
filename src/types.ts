export interface IConfig {
  difficulty: number
  mineRate: number // ms
  initialBalance: number
}

export interface IGBlock {
  timestamp: number
  lastHash: string
  hash: string
  data: unknown
  nonce: number
  difficulty: number
}
