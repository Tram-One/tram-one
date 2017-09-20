const Tram = require('../../tram-one')
const app = new Tram()

const html = Tram.html()

const home = () => {
  return html`
    <div>
      <h1>This is the routes example!</h1>

      Tram-One uses
      <a href="https://github.com/yoshuawuyts/nanorouter">nanorouter</a>
      to handle routes.
      <br>
      With nanorouter, Tram-One supports routes,
      path params, hash routes, and wildcards.
      <br><br>

      Note: in order to use some dynamic routes, you'll need a server, or hosting to
      handle client side routing (like <a href="https://surge.sh/">surge.sh</a>)

      <br><br>
      <a href="/page1">Go to Page 1</a>
    </div>
  `
}

const page1 = () => {
  return html`
    <div>
      <h2>This is the First Page!</h2>

      <a href="/">Go to the Home Page</a>
      <br>
      <a href="/page#2">Go to page 2</a>
    </div>
  `
}

const page2 = () => {
  return html`
    <div>
      <h2>This is the Second Page!</h2>

      <a href="/">Go to the Home Page</a>
      <br>
      <a href="/page/3">Go to page 3</a>
    </div>
  `
}

const pageN = (state) => {
  return html`
    <div>
      <h2>This is Page ${state.url.page}!</h2>

      <a href="/">Go to the Home Page</a>
      <br>
      <a href="/page/${parseInt(state.url.page, 10) + 1}">Go to page ${parseInt(state.url.page, 10) + 1}</a>
    </div>
  `
}

const nopath = () => {
  return html`
    <div>
      <h2>404!</h2>
    </div>
  `
}

app.addRoute('/', home)
app.addRoute('/page1', page1)
app.addRoute('/page#2', page2)
app.addRoute('/page/:page', pageN)
app.addRoute('/404', nopath)

app.start('.main')
