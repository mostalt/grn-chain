import Websocket, { WebSocket } from 'ws'

import { GTransaction, GTransactionPool } from '../wallet'
import { GBlock } from '../blockchain/block'
import { GChain } from '../blockchain/chain'
import { GBlockDTO, GTransactionDTO } from '../types'

type P2PMessage =
  | {
      type: 'CHAIN'
      chain: GBlockDTO[]
    }
  | {
      type: 'TRANSACTION'
      transaction: GTransactionDTO
    }

const P2P_PORT = Number(process.env.P2P_PORT) || 5001
const PEERS: string[] = process.env.PEERS ? process.env.PEERS.split(',') : []
const MESSAGE_TYPES = {
  chain: 'CHAIN',
  transaction: 'TRANSACTION',
} as const

export class P2PServer {
  constructor(blockchain: GChain, pool: GTransactionPool) {
    this._blockchain = blockchain
    this._pool = pool
    this._sockets = []
  }

  private _blockchain: GChain
  private _pool: GTransactionPool
  private _sockets: WebSocket[]

  private _connectSocket(socket: WebSocket) {
    this._sockets.push(socket)
    console.log('Socket connected')

    this._messageHandler(socket)
    this._sendChain(socket)
  }

  private _connectToPeers() {
    PEERS.forEach((peer) => {
      const socket = new WebSocket(peer)

      socket.on('open', () => this._connectSocket(socket))
    })
  }

  private _messageHandler(socker: WebSocket) {
    socker.on('message', (message) => {
      const data: P2PMessage = JSON.parse(message.toString())

      switch (data.type) {
        case MESSAGE_TYPES.chain:
          const chain = data.chain.map((obj) => {
            const { _timestamp, _lastHash, _hash, _data, _nonce, _difficulty } = obj
            return new GBlock(_timestamp, _lastHash, _hash, _data, _nonce, _difficulty)
          })
          this._blockchain.replaceChain(chain)
          break

        case MESSAGE_TYPES.transaction:
          const { _id, _input, _outputs } = data.transaction

          const transaction = new GTransaction(_id, _input, _outputs)
          this._pool.updateOrAddTransaction(transaction)
          break
      }
    })
  }

  private _sendChain(socket: WebSocket) {
    socket.send(
      JSON.stringify({
        type: MESSAGE_TYPES.chain,
        chain: this._blockchain.chain,
      }),
    )
  }

  private _sendTransation(socket: WebSocket, transaction: GTransaction) {
    socket.send(
      JSON.stringify({
        type: MESSAGE_TYPES.transaction,
        transaction,
      }),
    )
  }

  public broadcastTransaction(transaction: GTransaction) {
    this._sockets.forEach((socket) => {
      this._sendTransation(socket, transaction)
    })
  }

  public syncChains() {
    this._sockets.forEach((socket) => this._sendChain(socket))
  }

  public listen() {
    const server = new Websocket.Server({ port: P2P_PORT })
    server.on('connection', (socket) => {
      this._connectSocket(socket)
    })

    this._connectToPeers()
    console.log(`Listening for p2p connections on port ${P2P_PORT}`)
  }
}
