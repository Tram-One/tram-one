const Tram = require('../../tram-one')
const app = new Tram()
const html = Tram.html()

// pages
const homePage = () => html`<div>HOME</div>`
const numberPage = (state) => html`<div>${state.number}</div>`

// reducers
const numberReducer = (number, action) => {
  switch (action.type) {
    case ('INCREMENT'):
      return number + 1
    case ('DECREMENT'):
      return number - 1
    default:
      return number
  }
}

app.addRoute('/', homePage)
app.addRoute('/number', numberPage)
app.addReducer('number', numberReducer, 0)

module.exports = {
  app: app,
  reducer: numberReducer,
  pages: {
    homePage: homePage,
    numberPage: numberPage
  }
}
