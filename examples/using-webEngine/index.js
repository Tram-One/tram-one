const Tram = require('../../tram-one')
window.engine = {}
const app = new Tram({
  webEngine: window.engine
})
const html = Tram.html({
  'counter-button': require('./counter-button'),
  'mapped-counter-button': require('./mapped-counter-button')
})

const countActions = {
  init: () => 0,
  click: (clickCount) => clickCount + 1
}

const clicker = (state, actions) => {
  return html`
    <div>
      Tram-One includes a webEngine option which allows you to pull
      in the state of an element without passing props explicitly.
      <br />
      <counter-button />
      <mapped-counter-button />
    </div>
  `
}

app.addActions({counter: countActions})
app.addRoute('/', clicker)
app.start('.main')
