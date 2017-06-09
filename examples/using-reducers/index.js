const Tram = require('../../index')
const xtend = require('xtend')

const app = new Tram()

const html = Tram.html({})

const counterReducer = (state, action) => {
  if (action.type === 'click') {
    return xtend(state, { clicks: state.clicks + 1 })
  }
  return state
}

const clicker = (state) => {
  const incrementCount = () => {
    console.log("I've been clicked!")
    state.dispatch({type: 'click'})
  }
  return html`
    <div>
      Tram-One uses minidux and yo-yo to handle state management.
      <br><br>

      <button onclick=${incrementCount}>
        This button has been clicked ${state.counter.clicks} times!
      </button>
    </div>
  `
}

app.addReducer('counter', counterReducer, {clicks: 0})
app.addRoute('/', clicker)
app.start('.main')
