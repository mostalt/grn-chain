import express from 'express'
import bodyParser from 'body-parser'

import { GChain } from '../blockchain/chain'
import { P2PServer } from './p2p'
import { GWallet } from '../wallet'
import { GTransactionPool } from '../wallet'

const HTTP_PORT = process.env.HTTP_PORT || 4200

const app = express()
const blockChain = new GChain()
const wallet = new GWallet()
const pool = new GTransactionPool()
const p2p = new P2PServer(blockChain, pool)

app.use(bodyParser.json())

// api

app.get('/blocks', (_req, res) => {
  res.json(blockChain.chain)
})

app.post('/mine', (req, res) => {
  const block = blockChain.addGBlock(req.body.data)
  console.log(`New block added: ${block.toString()}`)

  p2p.syncChains()

  res.redirect('/blocks')
})

app.get('/transactions', (_req, res) => {
  res.json(pool.transactions)
})

app.post('/transact', (req, res) => {
  const { recipient, amount }: { recipient: string; amount: number } = req.body
  const transaction = wallet.createTransaction(recipient, amount, pool)

  if (transaction) {
    p2p.broadcastTransaction(transaction)
    res.redirect('/transactions')
  } else {
    res.sendStatus(500).json({ error: 'invalid transaction' })
  }
})

app.get('/publicKey', (_req, res) => {
  res.json({ publicKey: wallet.publicKey })
})

// server

const server = app.listen(HTTP_PORT, () => {
  console.log(`Listening on port ${HTTP_PORT}`)
})

p2p.listen()

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
  })
})
