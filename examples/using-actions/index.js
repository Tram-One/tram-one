const Tram = require('../../tram-one')
const app = new Tram()
const html = Tram.html()

const countActions = {
  init: () => 0,
  click: (clickCount) => clickCount + 1
}

const clicker = (state, actions) => {
  const incrementCount = () => {
    console.log(`I've been clicked!`)
    actions.click()
  }
  return html`
    <div>
      Tram-One uses
      <a href="https://github.com/JRJurman/hover-engine">Hover-Engine</a> and
      <a href="https://github.com/choojs/nanomorph">nanomorph</a>
      to handle state management and DOM diffing.
      <br />
      <button onclick=${incrementCount}>
        This button has been clicked ${state.counter} times!
      </button>
    </div>
  `
}

app.addActions({counter: countActions})
app.addRoute('/', clicker)
app.start('.main')
