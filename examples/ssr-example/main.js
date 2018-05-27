const app = require('./index.js')
const numberActions = {
  init: () => (Math.random() * 100).toFixed(2),
  newNumber: () => (Math.random() * 100).toFixed(2)
}
app.addActions({number: numberActions})
app.start('.main')
