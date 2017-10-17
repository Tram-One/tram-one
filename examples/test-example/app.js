const Tram = require('../../tram-one')
const app = new Tram()
const html = Tram.html()

// pages
const homePage = () => html`<div>HOME</div>`
const numberPage = (store, actions, params) => html`<div>${params.number}</div>`

app.addRoute('/', homePage)
app.addRoute('/:number', numberPage)

module.exports = {
  app: app,
  pages: {
    homePage: homePage,
    numberPage: numberPage
  }
}
