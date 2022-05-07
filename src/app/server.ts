import express from 'express'
import bodyParser from 'body-parser'

import { GChain } from '../blockchain/chain'
import { P2PServer } from './p2p'

const HTTP_PORT = process.env.HTTP_PORT || 4200

const app = express()
const blockChain = new GChain()
const p2p = new P2PServer(blockChain)

app.use(bodyParser.json())

app.get('/blocks', (_req, res) => {
  res.json(blockChain.chain)
})

app.post('/mine', (req, res) => {
  const block = blockChain.addGBlock(req.body.data)
  console.log(`New block added: ${block.toString()}`)

  p2p.syncChains()

  res.redirect('/blocks')
})

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
