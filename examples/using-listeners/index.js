const Tram = require('../../tram-one')
const app = new Tram()
const html = Tram.html()

const countActions = {
  init: () => parseInt(localStorage.count, 10) ? parseInt(localStorage.count, 10) : 0,
  up: (count) => count + 1,
  down: (count) => count - 1
}

const clicker = (store, actions) => {
  const up = () => {
    actions.up()
  }
  const down = () => {
    actions.down()
  }

  return html`
    <div>
      You can use Tram-One's
      <a href="https://github.com/JRJurman/hover-engine">Hover-Engine</a>
      to listen for state change, and debug or save whatever the current state is.
      <br />
      <div>
        Current Value: ${store.counter}
      </div>
      <button onclick=${up}>
        UP
      </button>
      <button onclick=${down}>
        DOWN
      </button>
    </div>
  `
}

app.addListener(store => {
  console.log('Current Value', store.counter)
  localStorage.count = store.counter
})
app.addActions({counter: countActions})
app.addRoute('/', clicker)
app.start('.main')
