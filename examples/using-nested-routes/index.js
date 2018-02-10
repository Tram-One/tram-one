const Tram = require('../../tram-one')
const app = new Tram({windowed: true})

const html = Tram.html({
  selection: require('./elements/selection')
})
const route = Tram.route()

const chrome = (state, actions, params, children) => {
  const childView = children ? children : html`
    <div>Tram-One also supports composing views based on routes!</div>
  `

  return html`
    <div style="text-align: center; max-width: 600px; margin: auto;">
      <h1>Top Page</h1>
      <selection>
        <a href="/alpha">alpha</a>
        <a href="/beta">beta</a>
        <a href="/gamma">gamma</a>
      </selection>
      <div style="background: #EEE; padding: 0.5em;">
        ${childView}
      </div>
    </div>
  `
}

app.addRoute('/', chrome, [
  route('alpha', require('./pages/alpha')),
  route('beta', require('./pages/beta')),
  route('gamma', require('./pages/gamma'), [
    route('/one', require('./pages/gamma-one')),
    route('/two', require('./pages/gamma-two'))
  ])
])

app.start('.main')
