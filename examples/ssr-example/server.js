// to run this example, run `node examples/ssr-example/server.js`

const express = require('express')
const server = express()
const app = require('./index')

const pageWithBundle = (page, src) => `
  <html>
    <head></head>
    <body>
      <div class="main">
        ${page}
      </div>
      <script src="${src}"></script>
    </body>
  </html>
`

server.use(express.static('dist'))

server.get('/', (req, res) => {
  res.send(app.toString('/'))
})

server.get('/number', (req, res) => {
  const number = (Math.random() * 100).toFixed(2)
  const page = app.toString('/number', {number})
  res.set('Content-Type', 'text/html')
  res.send(pageWithBundle(page, '/bundle.js'))
})

server.listen(5000, () => {
  console.log('ssr express server running on port 5000!')
})
