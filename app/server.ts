import express from 'express'
import bodyParser from 'body-parser'

import { GChain } from '../blockchain/chain'

const HTTP_PORT = process.env.HTTP_PORT || 4200

const blockChain = new GChain()
const app = express()

app.use(bodyParser.json())

app.get('/blocks', (_req, res) => {
  res.json(blockChain.chain)
})

app.post('/mine', (req, res) => {
  const block = blockChain.addGBlock(req.body.data)
  console.log(`New block added: ${block.toString()}`)

  res.redirect('/blocks')
})

const server = app.listen(HTTP_PORT, () => {
  console.log(`Listening op port ${HTTP_PORT}`)
})

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
  })
})
