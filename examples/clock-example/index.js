const Tram = require('../../tram-one')
const app = new Tram()

const html = Tram.html({clock: require('./elements/clock')})

const startTicker = (state, actions) => {
  if (!state.ticker.wound) {
    actions.wind()
    setInterval(actions.tick, 1000)
  }
}

const clockFrame = (state, actions) => html`
  <div style="text-align: center" onload=${startTicker(state, actions)}>
    <h1>SVG Clock Example</h1>
    <clock ticker=${state.ticker.date} />
  </div>
`

app.addActions({ticker: require('./actions/ticker')})
app.addRoute('/', clockFrame)

app.start('.main')
