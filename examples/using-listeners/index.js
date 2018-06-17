const Tram = require('../../tram-one')
const app = new Tram({webStorage: sessionStorage})
const html = Tram.html()

const countActions = {
  init: () => 0,
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
      to listen for state changes and debug whatever the current state is.

      Open the console window to see logging.
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

// log what is happening on the store
app.addListener((store, actions, actionName) => {
  console.log(actionName, '->', store.counter)
})

app.addActions({counter: countActions})
app.addRoute('/', clicker)
app.start('.main')
