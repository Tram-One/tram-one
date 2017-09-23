// to run this example, run `node examples/ssr-example/server.js`

const express = require('express')
const server = express()
const app = require('./index')

server.get('/', (req, res) => {
  res.send(app.toString('/'))
})

server.get('/num', (req, res) => {
  const number = Math.random() * 10
  res.send(app.toString('/number', {number}))
})

server.listen(5000, () => {
  console.log('ssr express server running on port 5000!')
})
