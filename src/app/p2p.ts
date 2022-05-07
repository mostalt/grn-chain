import { GBlock } from '../blockchain/block'
import Websocket, { WebSocket } from 'ws'
import { GChain } from '../blockchain/chain'

const P2P_PORT = Number(process.env.P2P_PORT) || 5001
const peers: string[] = process.env.PEERS ? process.env.PEERS.split(',') : []

type TransferObject = {
  _timestamp: number
  _lastHash: string
  _hash: string
  _data: unknown
}

export class P2PServer {
  private _blockchain: GChain
  private _sockets: WebSocket[]

  constructor(blockchain: GChain) {
    this._blockchain = blockchain
    this._sockets = []
  }

  private _connectSocket(socket: WebSocket) {
    this._sockets.push(socket)
    console.log('Socket connected')

    this._messageHandler(socket)
    this._sendChain(socket)
  }

  private _connectToPeers() {
    peers.forEach((peer) => {
      const socket = new WebSocket(peer)

      socket.on('open', () => this._connectSocket(socket))
    })
  }

  private _messageHandler(socker: WebSocket) {
    socker.on('message', (message) => {
      const objArr: TransferObject[] = JSON.parse(message.toString())
      const chain = objArr.map(
        ({ _timestamp, _lastHash, _hash, _data }) =>
          new GBlock(_timestamp, _lastHash, _hash, _data),
      )

      console.log(chain)
      this._blockchain.replaceChain(chain)
    })
  }

  private _sendChain(socket: WebSocket) {
    socket.send(JSON.stringify(this._blockchain.chain))
  }

  syncChains() {
    this._sockets.forEach((socket) => this._sendChain(socket))
  }

  listen() {
    const server = new Websocket.Server({ port: P2P_PORT })
    server.on('connection', (socket) => {
      this._connectSocket(socket)
    })

    this._connectToPeers()
    console.log(`Listening for p2p connections on port: ${P2P_PORT}`)
  }
}
