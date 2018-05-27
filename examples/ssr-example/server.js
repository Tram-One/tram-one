// to run this example, run `node examples/ssr-example/server.js`

const express = require('express')
const server = express()
const app = require('./index')

// page template so we can hydrate the page
// with javascript after the initial load
const pageWithBundle = (page, src) => `
  <div class="main">
    ${page}
  </div>
  <script src="${src}"></script>
`

server.use(express.static('dist'))

// serve the home page, with no bundle
// because it needs no hydration
server.get('/', (req, res) => {
  res.send(app.toString('/'))
})

// serve the number page with a bundle
// so that we can use js on the page
server.get('/number', (req, res) => {
  const number = (Math.random() * 100).toFixed(2)
  const page = app.toString('/number', {number})
  res.send(pageWithBundle(page, '/bundle.js'))
})

server.listen(5000, () => {
  console.log('ssr express server running on http://localhost:5000')
})
