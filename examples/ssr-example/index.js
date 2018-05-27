const Tram = require('../../tram-one')
const app = new Tram()
const html = Tram.html()

const numberActions = {
  init: () => (Math.random() * 100).toFixed(2),
  newNumber: () => (Math.random() * 100).toFixed(2)
}

app.addActions({number: numberActions})

const home = () => html`
  <div>
    <h1>This is the Home Page</h1>
    <div> This is rendered on a server, and then served up to you! </div>
    <div> If you have JS disabled, this page will still work.</div>
    <div> We also have a number page here: <a href="/number">/number</a> </div>
  </div>
`

app.addRoute('/', home)

const num = (state, actions) => {
  const onNewNumber = () => {
    actions.newNumber()
  }
  return html`
    <div>
      <h1>This is a Number Page</h1>
      <div> This is rendered on a server, and then served up to you! </div>
      <div> If you have JS disabled, this page will still work.</div>
      <div> We can even take in stuff from the server, like this number: ${state.number} </div>
      <div> If you have JS enabled, we've hydrated the app with a bundled JS script tag, </div>
      <div> so you can do everything you normally could on a JS rich app. </div>
      <button onclick=${onNewNumber}> Generate New Number </button>
    </div>
  `
}

app.addRoute('/number', num)

module.exports = app
